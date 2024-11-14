const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] // References to students who attended
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
