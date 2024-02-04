const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');
const { SubjectTypeEnum } = require('../../enums');

const MasterSubjectSchema = mongoose.Schema(
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
      ref: 'master-semesters',
      required: true,
    },
    staff: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    subjectType: {
      type: String,
      enum: Object.values(SubjectTypeEnum),
      default: SubjectTypeEnum.WRITTEN,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

MasterSubjectSchema.plugin(accessibleRecordsPlugin);
MasterSubjectSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('master-subjects', MasterSubjectSchema);
