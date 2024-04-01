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
    department: {
      type: mongoose.Types.ObjectId,
      ref: 'departments',
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
    // resultBySemesters: {
    //   semester1: {
    //     resultId: '',
    //     status: 'PASS',
    //     batch: 2023,
    //   },
    //   semester2: {
    //     resultId: '',
    //     status: 'ATKT',
    //     batch: 2023,
    //   },
    //   semester3: {
    //     resultId: '',
    //     status: 'PASS',
    //     batch: 2024,
    //   },
    //   semester4: {
    //     resultId: '',
    //     status: 'ATKT',
    //     batch: 2024,
    //   },
    // },
  },
  { timestamps: true },
);

module.exports = mongoose.model('students', StudentSchema);
