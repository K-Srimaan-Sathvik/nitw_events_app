require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { testConnection } = require('./config/database');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

const origins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
const corsOptions = origins.length === 0 || origins.includes('*')
  ? { origin: true, credentials: true }
  : { origin: origins, credentials: true };
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api', routes);

testConnection().then(async () => {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
});
