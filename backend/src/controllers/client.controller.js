const ClientModel = require('../models/client.model');

const ClientController = {
  list(_req, res) {
    const clients = ClientModel.getAll();
    res.json(clients);
  },

  getById(req, res) {
    const client = ClientModel.getById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  },

  create(req, res) {
    const id = ClientModel.create(req.body);
    const client = ClientModel.getById(id);
    res.status(201).json(client);
  },

  update(req, res) {
    const existing = ClientModel.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Client not found' });
    ClientModel.update(req.params.id, req.body);
    const updated = ClientModel.getById(req.params.id);
    res.json(updated);
  },

  delete(req, res) {
    const existing = ClientModel.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Client not found' });
    ClientModel.delete(req.params.id);
    res.status(204).end();
  },
};

module.exports = ClientController;
