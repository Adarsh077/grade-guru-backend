const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const MasterDepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    hod: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    codeForSeatNo: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

MasterDepartmentSchema.plugin(accessibleRecordsPlugin);
MasterDepartmentSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('master-departments', MasterDepartmentSchema);
