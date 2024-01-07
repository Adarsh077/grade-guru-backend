const mongoose = require('mongoose');
const { ExamNamesEnum } = require('../enums');

const ExamSchema = mongoose.Schema({
  name: {
    type: String,
    enum: Object.keys(ExamNamesEnum),
    required: true,
  },
  maxMarksRequired: {
    type: Number,
    default: 0,
  },
  minMarksRequired: {
    type: Number,
    default: 0,
  },
});

const MarksOfExamsByStudent = mongoose.Schema({
  examName: {
    type: String,
    enum: Object.keys(ExamNamesEnum),
    required: true,
  },
  marksScored: {
    type: Number,
    default: null,
  },
});

const ExamsByStudent = mongoose.Schema({
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'students-by-semesters',
  },
  marksOfExamsByStudent: {
    type: [MarksOfExamsByStudent],
    default: [],
  },
});

const MarksBySubjectSchema = mongoose.Schema(
  {
    subject: {
      type: mongoose.Types.ObjectId,
      ref: 'subjects',
    },
    exams: {
      type: [ExamSchema],
      default: [],
    },
    examsByStudents: {
      type: [ExamsByStudent],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('marks-by-subjects', MarksBySubjectSchema);
