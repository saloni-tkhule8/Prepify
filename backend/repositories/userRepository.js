const User = require('../models/User');

const findByEmail = (email) => User.findOne({ email });
const findById    = (id)    => User.findById(id).select('-password');
const createUser  = (data)  => User.create(data);
const deleteById  = (id)    => User.findByIdAndDelete(id);

module.exports = { findByEmail, findById, createUser, deleteById };
