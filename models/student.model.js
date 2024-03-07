const mongoose = require('mongoose');
const { StudentTypeEnum } = require('../enums');

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    studentType: {
      type: String,
      enum: Object.values(StudentTypeEnum),
      required: true,
    },
    admissionYear: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('students', StudentSchema);
