import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './server/models/Product.js';
import { Course } from './server/models/Course.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  try {
    const products = await Product.find();
    console.log(products);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
run();
