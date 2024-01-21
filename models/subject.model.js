const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const SubjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
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

SubjectSchema.plugin(accessibleRecordsPlugin);
SubjectSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('subjects', SubjectSchema);
