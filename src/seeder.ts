import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import Ticket from './models/Ticket';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    const hash = bcrypt.hashSync("password", 8);
    await User.deleteMany({});
    await Ticket.deleteMany({});
    const [l1, l2, l3] = await User.insertMany([
      { email: 'l1@example.com', password: hash, role: 'L1', name: 'Helpdesk Agent' },
      { email: 'l2@example.com', password: hash, role: 'L2', name: 'Technical Support' },
      { email: 'l3@example.com', password: hash, role: 'L3', name: 'Advanced Support' },
    ]);
    console.log('👥 Users seeded');
    await Ticket.create({
      title: 'Printer not working',
      description: 'Cannot print from Office printer 01',
      category: 'Hardware',
      expectedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      priority: 'Medium',
      status: 'New',
      createdBy: l1._id,
      assignedTo: l1._id,
      escalationLevel: 0,
      logs: []
    });
    await Ticket.create({
      title: 'Email service slow',
      description: 'Outlook loading too slowly across the department',
      category: 'Software',
      expectedCompletion: new Date(Date.now() + 8 * 60 * 60 * 1000),
      priority: 'High',
      status: 'Attending',
      createdBy: l1._id,
      assignedTo: l2._id,
      escalationLevel: 1,
      criticalLevel: 'C2',
      escalatedBy: l1._id,
      logs: [
        { actionBy: l2._id, role: 'L2', note: 'Assigned C2 by L2' }
      ]
    });
    await Ticket.create({
      title: 'Server room power failure',
      description: 'Main DB server shut down due to unknown reason',
      category: 'Infrastructure',
      expectedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'High',
      status: 'Attending',
      createdBy: l1._id,
      assignedTo: l3._id,
      escalationLevel: 2,
      criticalLevel: 'C1',
      escalatedBy: l2._id,
      logs: [
        { actionBy: l2._id, role: 'L2', note: 'Assigned C1, escalated to L3' },
        { actionBy: l3._id, role: 'L3', note: 'Investigating and applying fix' }
      ]
    });
    console.log('🎫 Tickets for L1, L2, and L3 seeded');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
