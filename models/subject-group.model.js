const mongoose = require('mongoose');

const SubjectGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    semester: {
      type: mongoose.Types.ObjectId,
      ref: 'semesters',
      required: true,
    },
    enrolledStudents: {
      type: [mongoose.Types.ObjectId],
      ref: 'students',
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isATKTSubjectGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('subject-groups', SubjectGroupSchema);
