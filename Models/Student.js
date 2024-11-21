const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'classes', required: true },
  // You can omit attendance here to avoid redundancy
}, { timestamps: true });

module.exports = mongoose.model('students', studentSchema);
