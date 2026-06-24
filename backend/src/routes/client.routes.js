const { Router } = require('express');
const ClientController = require('../controllers/client.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', ClientController.list);
router.post('/', ClientController.create);
router.get('/:id', ClientController.getById);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);

module.exports = router;
