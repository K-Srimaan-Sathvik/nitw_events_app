const express = require('express');
const auth = require('./auth');
const publicRoutes = require('./public');
const student = require('./student');
const leader = require('./leader');
const admin = require('./admin');
const { sequelize } = require('../models');

const router = express.Router();

router.use('/auth', auth);
router.use('/public', publicRoutes);
router.use('/student', student);
router.use('/leader', leader);
router.use('/admin', admin);

router.get('/sync', async (_req, res) => {
  await sequelize.sync({ alter: true });
  res.json({ success: true });
});

module.exports = router;
