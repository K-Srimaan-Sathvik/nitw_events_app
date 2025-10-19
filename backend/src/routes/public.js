const express = require('express');
const { Club, Event, Announcement, User } = require('../models');

const router = express.Router();

router.get('/clubs', async (_req, res) => {
  const clubs = await Club.findAll({ include: [{ model: User, as: 'leader', attributes: ['id', 'name'] }] });
  res.json(clubs);
});

router.get('/clubs/:id', async (req, res) => {
  const club = await Club.findByPk(req.params.id, {
    include: [
      { model: User, as: 'leader', attributes: ['id', 'name'] },
      { model: Event },
      { model: Announcement },
    ],
  });
  if (!club) return res.status(404).json({ error: 'Not found' });
  res.json(club);
});

router.get('/events', async (_req, res) => {
  const events = await Event.findAll({ include: [{ model: Club }] });
  res.json(events);
});

router.get('/clubs/:id/announcements', async (req, res) => {
  const anns = await Announcement.findAll({ where: { clubId: req.params.id } });
  res.json(anns);
});

module.exports = router;
