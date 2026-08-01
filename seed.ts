import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { AdminUser } from './server/models/AdminUser';

dotenv.config();

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const email = process.env.ADMIN_EMAIL || 'admin@terqivo.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await AdminUser.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'Super Admin'
    });

    console.log('Successfully created initial admin user.');
    console.log(`Email: ${email}`);
    console.log('Password: [hidden]');
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
