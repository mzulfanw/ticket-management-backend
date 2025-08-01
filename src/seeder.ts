import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import bcrypt from 'bcrypt';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

async function seed() {
  const hash = bcrypt.hashSync("password", 8)
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await User.insertMany([
    { email: 'l1@example.com', password: hash, role: 'L1', name: 'Role L1' },
    { email: 'l2@example.com', password: hash, role: 'L2', name: 'Role L2' },
    { email: 'l3@example.com', password: hash, role: 'L3', name: 'Role L3' },
  ]);
  console.log('User seed complete');
  process.exit(0);
}

seed().catch(console.error);
