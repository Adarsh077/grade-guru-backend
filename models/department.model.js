const mongoose = require('mongoose');

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

module.exports = mongoose.model('departments', DepartmentSchema);
