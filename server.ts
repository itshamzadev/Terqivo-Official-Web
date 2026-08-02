import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import bcrypt from "bcryptjs";

import apiRoutes from "./server/routes/api";
import { AdminUser } from "./server/models/AdminUser";
import { getUploadsRoot } from "./server/utils/uploads";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Vite frontend isi project ke dist folder mein build hota hai.
const clientDistPath = path.resolve(process.cwd(), "dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

async function autoSeedAdmin(): Promise<void> {
  try {
    const adminCount = await AdminUser.countDocuments();

    if (adminCount > 0) {
      return;
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn(
        "Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing.",
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await AdminUser.create({
      name: "Super Admin",
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "Super Admin",
    });

    console.log(`Initial admin user created: ${email}`);
  } catch (error) {
    console.error("Auto-seed admin error:", error);
  }
}

async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn(
      "MONGODB_URI is not set. Server is running without a database connection.",
    );
    return;
  }

  try {
    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");

    await autoSeedAdmin();
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

async function createApp(): Promise<express.Express> {
  const app = express();

  app.disable("x-powered-by");

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  await connectDatabase();

  // Health route ko API router se pehle bhi rakh sakte hain.
  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV || "development",
      database:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  });

  // All backend routes
  
  // Serve uploads directory
  const uploadsPath = getUploadsRoot();
  app.use('/uploads', express.static(uploadsPath, { fallthrough: false, index: false }));

  app.use("/api", apiRoutes);

  if (isProduction) {
    // React/Vite build files serve karega.
    app.use(express.static(clientDistPath));

    /*
     * React Router fallback:
     * /about, /services, /admin jaisi frontend routes par
     * dist/index.html send hoga.
     *
     * /api ki unknown routes ko frontend HTML nahi milega.
     */
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith("/api")) {
        return next();
      }

      return res.sendFile(clientIndexPath, (error) => {
        if (error) {
          console.error("Frontend index.html serve error:", error);
          next(error);
        }
      });
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  }

  // Unknown API route
  app.use("/api", (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global error handler
  app.use(
    (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Server error:", error);

      const errorStatus = typeof error === "object" && error !== null && "status" in error && typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
      res.status(errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500).json({
        success: false,
        message: errorStatus === 404 ? "Not found" : "Internal server error",
      });
    },
  );

  return app;
}

async function startServer(): Promise<void> {
  try {
    const app = await createApp();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Frontend path: ${clientDistPath}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  console.log(`${signal} received. Shutting down server...`);

  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("MongoDB shutdown error:", error);
  }

  process.exit(0);
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

void startServer();
