import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Create the AdminUser schema manually for the seed script
    const adminSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['Super Admin', 'Admin', 'Editor'], default: 'Admin' }
    });
    
    // Check if model already exists to prevent OverwriteModelError
    const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminSchema);

    const email = process.env.ADMIN_EMAIL || 'admin@terqivo.com';
    const password = process.env.ADMIN_PASSWORD || 'securepassword';
    const name = process.env.ADMIN_NAME || 'Super Admin';

    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await AdminUser.create({
      name,
      email,
      password: hashedPassword,
      role: 'Super Admin'
    });

    console.log(`Successfully seeded Super Admin: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin();
