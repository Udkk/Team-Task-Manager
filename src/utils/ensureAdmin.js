import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const ensureAdmin = async () => {
  const name = process.env.ADMIN_NAME?.trim() || 'Admin User';
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  // In production, if admin env vars aren't provided, bypass initialization safely
  if (!email || !password) {
    console.warn(
      'Notice: ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping automatic admin initialization.'
    );
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role !== 'ADMIN') {
        existingUser.role = 'ADMIN';
        await existingUser.save();
        console.log(`Existing user promoted to admin: ${email}`);
      } else {
        console.log(`Admin account already exists: ${email}`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN'
    });

    console.log(`Admin account created: ${email}`);
  } catch (error) {
    console.error('Failed to initialize admin account:', error.message);
  }
};

export default ensureAdmin;