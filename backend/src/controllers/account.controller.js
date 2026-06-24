const AccountModel = require('../models/account.model');

const AccountController = {
  listByClient(req, res) {
    const accounts = AccountModel.getByClient(req.params.clientId);
    res.json(accounts);
  },

  create(req, res) {
    const data = { ...req.body, client_id: Number(req.params.clientId) };
    const id = AccountModel.create(data);
    const account = AccountModel.getById(id);
    res.status(201).json(account);
  },

  update(req, res) {
    const existing = AccountModel.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Account not found' });
    AccountModel.update(req.params.id, req.body);
    const updated = AccountModel.getById(req.params.id);
    res.json(updated);
  },

  delete(req, res) {
    const existing = AccountModel.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Account not found' });
    AccountModel.delete(req.params.id);
    res.status(204).end();
  },
};

module.exports = AccountController;
