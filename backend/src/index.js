const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initialize } = require('./config/database');
const { PORT } = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const UserModel = require('./models/user.model');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

//TODO: Remove not used route 
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.get('/.well-known/*', (_req, res) => res.status(204).end());

app.use(errorHandler);

initialize();

const existing = UserModel.findByUsername('andrew');
if (!existing) {
  UserModel.create({ username: 'andrew', password: 'changeme', displayName: 'Andrew', role: 'admin' });
  UserModel.create({ username: 'rebecca', password: 'changeme', displayName: 'Rebecca', role: 'editor' });
  UserModel.create({ username: 'maryann', password: 'changeme', displayName: 'Maryann', role: 'editor' });
  console.log('Seed: 3 users created (change passwords after first login)');
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
