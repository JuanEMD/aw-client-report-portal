const { Router } = require('express');
const AccountController = require('../controllers/account.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/client/:clientId', AccountController.listByClient);
router.post('/client/:clientId', AccountController.create);
router.put('/:id', AccountController.update);
router.delete('/:id', AccountController.delete);

module.exports = router;
