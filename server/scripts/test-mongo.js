require('dotenv').config();
const mongoose = require('mongoose');

async function checkAtlas() {
  console.log('Testing Atlas URI from .env...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('CONNECTED TO MONGODB ATLAS SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Atlas Connection Error:', err.message);
    process.exit(1);
  }
}

checkAtlas();
