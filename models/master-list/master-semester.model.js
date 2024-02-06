const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const MasterSemesterSchema = new mongoose.Schema(
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
      ref: 'master-departments',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

MasterSemesterSchema.plugin(accessibleRecordsPlugin);
MasterSemesterSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('master-semesters', MasterSemesterSchema);
