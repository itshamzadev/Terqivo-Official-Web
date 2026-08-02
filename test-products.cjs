const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const products = await mongoose.connection.collection('products').find().toArray();
    console.log(products);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
run();
