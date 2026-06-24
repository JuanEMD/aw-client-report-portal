const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initialize } = require('./config/database');
const { PORT } = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
