require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Club, Event, Announcement } = require('../models');

async function run() {
  await sequelize.sync({ force: true });
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await User.create({ name: 'Admin', email: 'admin@nitw.ac.in', passwordHash, role: 'admin' });
  const leader = await User.create({ name: 'Club Lead', email: 'lead@nitw.ac.in', passwordHash, role: 'leader' });
  const student = await User.create({ name: 'Student', email: 'student@nitw.ac.in', passwordHash, role: 'student' });

  const c1 = await Club.create({ name: 'Coding Club', description: 'Competitive programming and dev', leaderId: leader.id });
  const c2 = await Club.create({ name: 'Robotics Club', description: 'Robots and automation', leaderId: leader.id });

  await Announcement.create({ clubId: c1.id, title: 'Welcome!', content: 'Kickoff meeting this weekend.' });

  const now = new Date();
  const e1 = await Event.create({ clubId: c1.id, title: 'Hackathon', description: '24h hack', date: new Date(now.getTime() + 86400000), location: 'Main Hall', maxParticipants: 100 });
  const e2 = await Event.create({ clubId: c2.id, title: 'Robo Race', description: 'Line following challenge', date: new Date(now.getTime() + 172800000), location: 'Lab 1', maxParticipants: 50 });

  console.log('Seeded users:', { admin: admin.email, leader: leader.email, student: student.email });
  console.log('Seed complete');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
