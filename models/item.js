const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  heading: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Data',
  },
  comp: {
    required: true,
    type: Boolean,
  },
});

module.exports = mongoose.model('Item', itemSchema);

