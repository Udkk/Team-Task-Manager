import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ensureAdmin from '../src/utils/ensureAdmin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGO_URL is not defined');
    }

    await mongoose.connect(mongoUri);

    await ensureAdmin();
  } catch (error) {
    console.error(`Seed admin error: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
