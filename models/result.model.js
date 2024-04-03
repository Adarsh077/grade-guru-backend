const mongoose = require('mongoose');
const { FinalResultEnum, ExamNamesEnum } = require('../enums');

const MarksBySubjectSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Types.ObjectId, required: true, ref: 'subjects' },
    subjectCode: { type: String, required: true },
    credits: { type: Number, required: true },
    gpc: { type: Number, required: true },
    exams: [
      {
        examName: {
          type: String,
          required: true,
          enum: Object.values(ExamNamesEnum),
        },
        marksO: {
          type: Number,
          required: true,
        },
        grade: {
          type: String,
          required: true,
        },
        graceMarks: {
          type: Number,
          default: 0,
        },
        marksOAfterGrace: {
          type: Number,
          required: true,
        },
        symbols: {
          type: [String],
          default: [],
        },
      },
    ],
  },
  { timestamps: true },
);

const ResultOfStudentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: 'students',
      required: true,
    },
    seatNo: {
      type: String,
      required: true,
    },
    sgpi: {
      type: Number,
      required: true,
    },
    finalResult: {
      type: String,
      required: true,
      enum: Object.values(FinalResultEnum),
    },
    cgpi: {
      type: Number,
      required: true,
    },
    marks: {
      type: [MarksBySubjectSchema],
      default: [],
    },
    marksOTotal: {
      type: Number,
      required: true,
    },
    creditsTotal: {
      type: Number,
      required: true,
    },
    gpcTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const ResultSchema = new mongoose.Schema(
  {
    semester: {
      type: mongoose.Types.ObjectId,
      ref: 'semesters',
      required: true,
    },
    subjectGroup: {
      type: mongoose.Types.ObjectId,
      ref: 'subject-groups',
      required: true,
    },
    students: {
      type: [ResultOfStudentSchema],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('results', ResultSchema);
