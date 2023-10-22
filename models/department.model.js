const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const DepartmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hod: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    batch: {
      type: String,
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

DepartmentSchema.plugin(accessibleRecordsPlugin);
DepartmentSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('departments', DepartmentSchema);
