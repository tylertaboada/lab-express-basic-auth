const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
