// backend/models/Entry.js
const mongoose = require('mongoose');

const entrySchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    mood: {
      type: String, // e.g., "Happy", "Melancholic"
      required: true,
    },
    musicQuery: {
      type: String, // What we will search on YouTube (e.g., "Sad piano music")
      required: true,
    },
    color: {
      type: String, // e.g., "#FF0000" for angry
      default: '#ffffff',
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
  }
);

module.exports = mongoose.model('Entry', entrySchema);