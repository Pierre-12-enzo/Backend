const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class_name: { type: String, required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'students' }], // References to students
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sessions' }] // References to sessions
}, { timestamps: true });

module.exports = mongoose.model('classes', classSchema);
