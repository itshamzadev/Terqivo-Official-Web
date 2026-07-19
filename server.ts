import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { createServer as createViteServer } from "vite";

import authRoutes from "./server/routes/auth";
import publicRoutes from "./server/routes/public";
import adminRoutes from "./server/routes/admin";

dotenv.config();

const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
if (process.env.NODE_ENV === "production") {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(
        `FATAL ERROR: Missing required environment variable: ${envVar}`,
      );
      process.exit(1);
    }
  }
}

async function startServer() {
  const app = express();
  const parsedPort = Number(process.env.PORT);
  const PORT = isNaN(parsedPort) || parsedPort === 0 ? 3000 : parsedPort;

  // Trust the reverse proxy
  app.set("trust proxy", 1);

  // Security Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(mongoSanitize());
  app.use(compression());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { error: "Too many requests, please try again later." },
    validate: {
      xForwardedForHeader: false,
      default: true,
    },
  });
  app.use("/api/", apiLimiter);

  const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());

  // Connect to MongoDB with retry logic
  const connectDB = async (retries = 5) => {
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        console.warn("\n⚠️  WARNING: MONGODB_URI is not defined.");
        console.warn(
          "⚠️  Please set the MONGODB_URI environment variable to connect to MongoDB.",
        );
        return;
      }
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log("Connected to MongoDB");
    } catch (error: any) {
      console.error("MongoDB connection error:", error.message);
      if (retries > 0) {
        console.log(
          `Retrying connection in 5 seconds... (${retries} retries left)`,
        );
        setTimeout(() => connectDB(retries - 1), 5000);
      } else {
        console.error(
          "Could not connect to MongoDB after multiple attempts. Exiting...",
        );
        process.exit(1);
      }
    }
  };
  await connectDB();

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "TERQIVO API is running",
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/public", publicRoutes);
  app.use("/api/admin", adminRoutes);

  // SEO Routes
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${process.env.VITE_SITE_URL || "https://terqivo.com"}/sitemap.xml`,
    );
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const siteUrl = process.env.VITE_SITE_URL || "https://terqivo.com";
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${siteUrl}/about</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/services</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/products</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/courses</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/jobs</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/blog</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/contact</loc><priority>0.8</priority></url>
</urlset>`;
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      res.status(500).end();
    }
  });

  // Global Error Handler for APIs
  app.use(
    "/api",
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("API Error:", err);
      res.status(err.status || 500).json({
        error: {
          message: err.message || "Internal Server Error",
          ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        },
      });
    },
  );

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");

    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), {
        immutable: true,
        maxAge: "1y",
      }),
    );

    app.use(express.static(distPath));

    app.get(/.*/, (req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = () => {
    console.log("Shutting down server gracefully...");
    server.close(() => {
      console.log("Closed out remaining connections.");
      mongoose.connection.close(false).then(() => {
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    });

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down",
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();
