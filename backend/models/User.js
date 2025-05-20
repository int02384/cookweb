const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
