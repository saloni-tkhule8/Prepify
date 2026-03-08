const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: function() {
      return !this.googleId && !this.githubId;
    }
  },
  profileImage: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  githubId: {
    type: String,
    sparse: true,
    unique: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local',
  },
}, { 
  versionKey: false,
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
