const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { User, Club, Event, Membership, Registration } = require('../models');
const { toCSV } = require('../utils/csv');
const { activityLogger } = require('../middleware/activity');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

// Users
router.get('/users', async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.put('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { name, role } = req.body;
  await user.update({ name, role });
  res.json(user);
});

// Clubs CRUD
router.post('/clubs', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'create_club',
  targetType: 'Club',
  metadata: { body: req.body },
})), async (req, res) => {
  const { name, description, leaderId } = req.body;
  const club = await Club.create({ name, description, leaderId });
  res.json(club);
});

router.put('/clubs/:id', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'update_club',
  targetType: 'Club',
  targetId: Number(req.params.id),
  metadata: { body: req.body },
})), async (req, res) => {
  const club = await Club.findByPk(req.params.id);
  if (!club) return res.status(404).json({ error: 'Not found' });
  const { name, description, leaderId } = req.body;
  await club.update({ name, description, leaderId });
  res.json(club);
});

router.delete('/clubs/:id', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'delete_club',
  targetType: 'Club',
  targetId: Number(req.params.id),
})), async (req, res) => {
  const club = await Club.findByPk(req.params.id);
  if (!club) return res.status(404).json({ error: 'Not found' });
  await club.destroy();
  res.json({ success: true });
});

// Reports
router.get('/reports/club/:clubId/participation.csv', async (req, res) => {
  const clubId = Number(req.params.clubId);
  const events = await Event.findAll({ where: { clubId } });
  const registrations = await Registration.findAll({ include: [Event] });
  const rows = registrations
    .filter((r) => r.Event && r.Event.clubId === clubId)
    .map((r) => ({ eventId: r.eventId, userId: r.userId }));
  const csv = await toCSV(rows, ['eventId', 'userId']);
  res.header('Content-Type', 'text/csv');
  res.attachment(`club_${clubId}_participation.csv`);
  res.send(csv);
});

router.get('/reports/event/:eventId/participants.csv', async (req, res) => {
  const eventId = Number(req.params.eventId);
  const regs = await Registration.findAll({ where: { eventId } });
  const csv = await toCSV(regs.map((r) => ({ userId: r.userId, eventId })), ['userId', 'eventId']);
  res.header('Content-Type', 'text/csv');
  res.attachment(`event_${eventId}_participants.csv`);
  res.send(csv);
});

// JSON summaries
router.get('/reports/club/:clubId/participation', async (req, res) => {
  const clubId = Number(req.params.clubId);
  const registrations = await Registration.findAll({ include: [Event] });
  const items = registrations
    .filter((r) => r.Event && r.Event.clubId === clubId)
    .map((r) => ({ eventId: r.eventId, userId: r.userId }));
  res.json({ clubId, count: items.length, registrations: items });
});

router.get('/reports/event/:eventId/participants', async (req, res) => {
  const eventId = Number(req.params.eventId);
  const regs = await Registration.findAll({ where: { eventId } });
  res.json({ eventId, count: regs.length, participants: regs.map((r) => r.userId) });
});

module.exports = router;
