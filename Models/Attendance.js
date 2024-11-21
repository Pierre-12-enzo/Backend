const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sessions', required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  comment: { type: String, default: '' }, // Reason for absence, if any
  date: { type: Date, required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'classes', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
