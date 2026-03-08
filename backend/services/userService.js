const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../repositories/userRepository');
const cloudinary = require('../config/cloudinary');

const register = async ({ name, email, password }) => {
  const exists = await repo.findByEmail(email);
  if (exists) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 12);
  const user = await repo.createUser({ 
    name, 
    email, 
    password: hashed,
    authProvider: 'local'
  });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return { 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      profileImage: user.profileImage,
      authProvider: user.authProvider
    } 
  };
};

const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  // Check if user registered with OAuth
  if (user.authProvider !== 'local' && (user.googleId || user.githubId)) {
    throw new Error(`This account was created with ${user.authProvider}. Please use ${user.authProvider} to login.`);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return { 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      profileImage: user.profileImage,
      authProvider: user.authProvider
    } 
  };
};

const getProfile = async (userId) => {
  const user = await repo.findById(userId);
  if (!user) throw new Error('User not found');
  return { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    profileImage: user.profileImage,
    authProvider: user.authProvider,
    googleId: user.googleId ? true : false,
    githubId: user.githubId ? true : false
  };
};

const updateProfileImage = async (userId, buffer) => {
  const user = await repo.findById(userId);
  if (!user) throw new Error('User not found');

  const oldId = user.profileImage?.publicId;
  if (oldId) await cloudinary.uploader.destroy(oldId);

  const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
  const result = await uploadToCloudinary(buffer);

  user.profileImage = {
    url:      result.secure_url,
    publicId: result.public_id,
  };

  await user.save();
  return { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    profileImage: user.profileImage,
    authProvider: user.authProvider
  };
};

const updateName = async (userId, name) => {
  if (!name || !name.trim()) throw new Error('Name cannot be empty.');
  const user = await repo.findById(userId);
  if (!user) throw new Error('User not found');

  user.name = name.trim();
  await user.save();
  return { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    profileImage: user.profileImage,
    authProvider: user.authProvider
  };
};

const deleteAccount = async (userId) => {
  const user = await repo.findById(userId);
  if (!user) throw new Error('User not found');

  const oldId = user.profileImage?.publicId;
  if (oldId) await cloudinary.uploader.destroy(oldId);

  await repo.deleteById(userId);
};

module.exports = { 
  register, 
  login, 
  getProfile, 
  updateProfileImage, 
  updateName, 
  deleteAccount 
};
