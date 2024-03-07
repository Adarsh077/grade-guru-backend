const mongoose = require('mongoose');
const { ExamNamesEnum } = require('../enums');

const ExamMarksSchema = new mongoose.Schema({
  examName: {
    type: String,
    enum: Object.keys(ExamNamesEnum),
    required: true,
  },
  marksScored: {
    type: Number,
    default: 0,
  },
});

const MarksOfStudentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: 'students',
      required: true,
    },
    exams: {
      type: [ExamMarksSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const MarksBySubjectSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Types.ObjectId,
      ref: 'subjects',
      required: true,
      unique: true,
    },
    marks: {
      type: [MarksOfStudentSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('marks-by-subjects', MarksBySubjectSchema);
