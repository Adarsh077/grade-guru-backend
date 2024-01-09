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

const MarksOfStudentByExam = mongoose.Schema({
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

const MarksOfStudent = mongoose.Schema({
  // students-by-semesters.students
  student: {
    type: mongoose.Types.ObjectId,
  },
  marksOfStudentByExam: {
    type: [MarksOfStudentByExam],
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
    marksOfStudents: {
      type: [MarksOfStudent],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('marks-by-subjects', MarksBySubjectSchema);
