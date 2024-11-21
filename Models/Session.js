const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'classes', required: true },
  date: { type: Date, required: true },
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'students' }] // References to students who attended
}, { timestamps: true });

module.exports = mongoose.model('Sessions', sessionSchema);
