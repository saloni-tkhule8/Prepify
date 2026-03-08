const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../repositories/userRepository');

const register = async ({ name, email, password }) => {
  const exists = await repo.findByEmail(email);
  if (exists) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 12);
  const user = await repo.createUser({ name, email, password: hashed });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

module.exports = { register, login };