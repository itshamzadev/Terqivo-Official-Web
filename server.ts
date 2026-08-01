import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './server/routes/api';
import bcrypt from 'bcryptjs';
import { AdminUser } from './server/models/AdminUser';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function autoSeedAdmin() {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@terqivo.com';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await AdminUser.create({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'Super Admin'
      });
      console.log(`Auto-seeded initial admin user: ${email}`);
    }
  } catch (error) {
    console.error('Auto-seed error:', error);
  }
}

async function createServer() {
  const app = express();
  
  app.use(express.json());
  app.use(cookieParser());

  // Connect to MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      await autoSeedAdmin();
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  } else {
    console.warn('MONGODB_URI is not set. Running without database connection.');
  }

  // API Routes will be mounted here
  app.use('/api', apiRoutes);
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

createServer().catch(console.error);
