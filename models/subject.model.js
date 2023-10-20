const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    semester: {
      type: mongoose.Types.ObjectId,
      ref: 'departments',
      required: true,
    },
    staff: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('subjects', SubjectSchema);
