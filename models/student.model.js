const mongoose = require('mongoose');
const { StudentTypeEnum, ResultBySemesterStatusEnum } = require('../enums');

const ResultBySemesterSchema = new mongoose.Schema(
  {
    resultId: {
      type: mongoose.Types.ObjectId,
      ref: 'semesters',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ResultBySemesterStatusEnum,
    },
    batch: {
      type: mongoose.Types.ObjectId,
      ref: 'batches',
    },
  },
  { timestamps: true },
);

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
    resultBySemesters: {
      semester2: {
        type: ResultBySemesterSchema,
        default: null,
      },
      semester3: {
        type: ResultBySemesterSchema,
        default: null,
      },
      semester4: {
        type: ResultBySemesterSchema,
        default: null,
      },
      semester5: {
        type: ResultBySemesterSchema,
        default: null,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('students', StudentSchema);
