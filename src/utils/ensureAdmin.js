import bcrypt from 'bcrypt';

import User from '../models/userModel.js';

const ensureAdmin = async () => {
  const name = process.env.ADMIN_NAME || 'Admin User';
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Admin seed skipped: ADMIN_EMAIL and ADMIN_PASSWORD are not set');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.password = hashedPassword;
    existingAdmin.role = 'ADMIN';
    await existingAdmin.save();

    console.log(`Admin account ready: ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'ADMIN'
  });

  console.log(`Admin account created: ${email}`);
};

export default ensureAdmin;
