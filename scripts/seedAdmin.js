import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from '../src/models/userModel.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const name = process.env.ADMIN_NAME || 'Admin User';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.password = await bcrypt.hash(password, 10);
      existingAdmin.role = 'ADMIN';
      await existingAdmin.save();

      console.log(`Admin updated: ${email}`);
    } else {
      await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: 'ADMIN'
      });

      console.log(`Admin created: ${email}`);
    }
  } catch (error) {
    console.error(`Seed admin error: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
