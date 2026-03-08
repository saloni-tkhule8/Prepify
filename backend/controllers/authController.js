const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded.' });
    }
    const user = await userService.updateProfileImage(req.user.id, req.file.buffer);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateName = async (req, res) => {
  try {
    const user = await userService.updateName(req.user.id, req.body.name);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await userService.deleteAccount(req.user.id);
    res.json({ success: true, message: 'Account deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const oauthSuccess = async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('OAuth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
  }
};

const oauthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Authentication failed')}`);
};

module.exports = { 
  register, 
  login, 
  getProfile, 
  updateProfileImage, 
  updateName, 
  deleteAccount,
  oauthSuccess,
  oauthFailure
};

