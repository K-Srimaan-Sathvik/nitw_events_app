const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { Club, Event, Announcement, Membership, User } = require('../models');
const { activityLogger } = require('../middleware/activity');

const router = express.Router();

router.use(authenticate, requireRole('leader', 'admin'));

// List clubs I lead
router.get('/me/clubs', async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { leaderId: req.user.id };
  const clubs = await Club.findAll({ where });
  res.json(clubs);
});

// List memberships for a club
router.get('/clubs/:clubId/memberships', async (req, res) => {
  const { clubId } = req.params;
  const club = await Club.findByPk(clubId);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  if (req.user.role !== 'admin' && club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const status = req.query.status;
  const where = { clubId };
  if (status) where.status = status;
  const memberships = await Membership.findAll({ where, include: [{ model: User, attributes: ['id', 'name', 'email'] }] });
  res.json(memberships);
});

// List events for club
router.get('/clubs/:clubId/events', async (req, res) => {
  const { clubId } = req.params;
  const club = await Club.findByPk(clubId);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  if (req.user.role !== 'admin' && club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const events = await Event.findAll({ where: { clubId } });
  res.json(events);
});

// List announcements for club
router.get('/clubs/:clubId/announcements', async (req, res) => {
  const { clubId } = req.params;
  const club = await Club.findByPk(clubId);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  if (req.user.role !== 'admin' && club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const anns = await Announcement.findAll({ where: { clubId } });
  res.json(anns);
});

// Create event for a club the leader owns
router.post('/clubs/:clubId/events', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'create_event',
  targetType: 'Club',
  targetId: Number(req.params.clubId),
  metadata: { body: req.body },
})), async (req, res) => {
  const { clubId } = req.params;
  const club = await Club.findByPk(clubId);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  if (req.user.role !== 'admin' && club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const { title, description, date, location, maxParticipants } = req.body;
  const event = await Event.create({ clubId, title, description, date, location, maxParticipants });
  res.json(event);
});

router.put('/events/:id', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'update_event',
  targetType: 'Event',
  targetId: Number(req.params.id),
  metadata: { body: req.body },
})), async (req, res) => {
  const event = await Event.findByPk(req.params.id, { include: [Club] });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (req.user.role !== 'admin' && event.Club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const { title, description, date, location, maxParticipants } = req.body;
  await event.update({ title, description, date, location, maxParticipants });
  res.json(event);
});

router.delete('/events/:id', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'delete_event',
  targetType: 'Event',
  targetId: Number(req.params.id),
})), async (req, res) => {
  const event = await Event.findByPk(req.params.id, { include: [Club] });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (req.user.role !== 'admin' && event.Club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  await event.destroy();
  res.json({ success: true });
});

router.post('/clubs/:clubId/announcements', activityLogger((req) => ({
  actorId: req.user.id,
  action: 'create_announcement',
  targetType: 'Club',
  targetId: Number(req.params.clubId),
  metadata: { body: req.body },
})), async (req, res) => {
  const { clubId } = req.params;
  const club = await Club.findByPk(clubId);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  if (req.user.role !== 'admin' && club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const { title, content } = req.body;
  const ann = await Announcement.create({ clubId, title, content });
  res.json(ann);
});

// Approve/Reject membership applications
router.post('/clubs/:clubId/memberships/:membershipId/:action', activityLogger((req) => ({
  actorId: req.user.id,
  action: `membership_${req.params.action}`,
  targetType: 'Membership',
  targetId: Number(req.params.membershipId),
})), async (req, res) => {
  const { clubId, membershipId, action } = req.params;
  const club = await Club.findByPk(clubId);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  if (req.user.role !== 'admin' && club.leaderId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const membership = await Membership.findByPk(membershipId);
  if (!membership) return res.status(404).json({ error: 'Membership not found' });
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' });
  await membership.update({ status: action === 'approve' ? 'approved' : 'rejected' });
  res.json(membership);
});

module.exports = router;
