const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  refreshToken: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Auth', authSchema);
