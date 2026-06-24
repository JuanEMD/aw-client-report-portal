const { Router } = require('express');
const ReportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/client/:clientId', ReportController.listByClient);
router.post('/client/:clientId', ReportController.create);
router.get('/:id', ReportController.getById);
router.put('/:id/data', ReportController.saveData);
router.post('/:id/calculate', ReportController.calculate);
router.post('/:id/generate', ReportController.generate);
router.get('/:id/pdf/sacs', ReportController.downloadSACS);
router.get('/:id/pdf/tcc', ReportController.downloadTCC);

module.exports = router;
