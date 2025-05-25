// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, minlength: 3 },
  passwordHash:{ type: String, required: true },
  role:        { 
    type: String, 
    enum: ['user','admin'], 
    default: 'user',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
