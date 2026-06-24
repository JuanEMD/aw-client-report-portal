const { Router } = require('express');
const authRoutes = require('./auth.routes');
const clientRoutes = require('./client.routes');
const accountRoutes = require('./account.routes');
const reportRoutes = require('./report.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/accounts', accountRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
