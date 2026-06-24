const ReportModel = require('../models/report.model');
const AccountModel = require('../models/account.model');
const ClientModel = require('../models/client.model');

const ReportController = {
  create(req, res) {
    const { quarter, year } = req.body;
    const clientId = req.params.clientId;
    const id = ReportModel.create(Number(clientId), quarter, year);
    const report = ReportModel.getById(id);
    res.status(201).json(report);
  },

  getById(req, res) {
    const report = ReportModel.getById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    const data = ReportModel.getData(report.id);
    res.json({ ...report, data });
  },

  listByClient(req, res) {
    const reports = ReportModel.getByClient(req.params.clientId);
    res.json(reports);
  },

  saveData(req, res) {
    const report = ReportModel.getById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    ReportModel.saveData(report.id, req.body);
    const data = ReportModel.getData(report.id);
    res.json(data);
  },

  calculate(req, res) {
    const report = ReportModel.getById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const data = ReportModel.getData(report.id);
    const accounts = AccountModel.getByClient(report.client_id);
    const client = ClientModel.getById(report.client_id);

    const sacs = ReportModel.calculateSACS(data);
    const tcc = ReportModel.calculateTCC(data, accounts, client);

    res.json({ client, sacs, tcc });
  },

  generate(req, res) {
    const report = ReportModel.getById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const data = ReportModel.getData(report.id);
    const accounts = AccountModel.getByClient(report.client_id);
    const client = ClientModel.getById(report.client_id);

    const sacs = ReportModel.calculateSACS(data);
    const tcc = ReportModel.calculateTCC(data, accounts, client);

    ReportModel.generate(report.id);

    res.json({ report: { ...report, status: 'generated' }, client, sacs, tcc });
  },

  downloadSACS(req, res) {
    // TODO: Implement PDF generation and streaming
    res.status(501).json({ error: 'PDF generation not implemented yet' });
  },

  downloadTCC(req, res) {
    // TODO: Implement PDF generation and streaming
    res.status(501).json({ error: 'PDF generation not implemented yet' });
  },
};

module.exports = ReportController;
