const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,            // Actual image data
    contentType: String,     // e.g., 'image/jpeg', 'image/png'
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Photo', PhotoSchema);
