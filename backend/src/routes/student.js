const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { Membership, Club, Registration, Event } = require('../models');
const { activityLogger } = require('../middleware/activity');

const router = express.Router();

router.use(authenticate, requireRole('student', 'leader', 'admin'));

// Apply to join a club
router.post('/clubs/:id/join', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'apply_membership',
  targetType: 'Club',
  targetId: Number(req.params.id),
})), async (req, res) => {
  const clubId = Number(req.params.id);
  const userId = req.user.id;
  const existing = await Membership.findOne({ where: { userId, clubId } });
  if (existing) return res.status(409).json({ error: 'Already applied or member' });
  const membership = await Membership.create({ userId, clubId, status: 'pending' });
  res.json(membership);
});

// View my memberships
router.get('/me/memberships', async (req, res) => {
  const memberships = await Membership.findAll({ where: { userId: req.user.id }, include: [Club] });
  res.json(memberships);
});

// Register for event
router.post('/events/:id/register', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'register_event',
  targetType: 'Event',
  targetId: Number(req.params.id),
})), async (req, res) => {
  const eventId = Number(req.params.id);
  const userId = req.user.id;
  const existing = await Registration.findOne({ where: { userId, eventId } });
  if (existing) return res.status(409).json({ error: 'Already registered' });
  // check capacity
  const event = await Event.findByPk(eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.maxParticipants) {
    const count = await Registration.count({ where: { eventId } });
    if (count >= event.maxParticipants) return res.status(409).json({ error: 'Event is full' });
  }
  const registration = await Registration.create({ userId, eventId });
  res.json(registration);
});

// View my event registrations
router.get('/me/registrations', async (req, res) => {
  const regs = await Registration.findAll({ where: { userId: req.user.id }, include: [Event] });
  res.json(regs);
});

module.exports = router;
