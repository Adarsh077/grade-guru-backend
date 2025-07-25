const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const SemesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: 'departments',
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

SemesterSchema.plugin(accessibleRecordsPlugin);
SemesterSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('semesters', SemesterSchema);
