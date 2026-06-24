const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const AuthController = {
  login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = UserModel.findByUsername(username);
    if (!user || !UserModel.validatePassword(user, password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user.id, username: user.username, displayName: user.display_name, role: user.role },
      token,
    });
  },

  logout(_req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  },

  me(req, res) {
    const user = UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  },
};

module.exports = AuthController;
