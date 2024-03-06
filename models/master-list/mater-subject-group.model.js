const mongoose = require('mongoose');

const MasterSubjectGroupSchema = new mongoose.Schema(
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  'master-subject-groups',
  MasterSubjectGroupSchema,
);
