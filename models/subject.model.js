const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');
const { SubjectTypeEnum } = require('../enums');

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    subjectGroup: {
      type: mongoose.Types.ObjectId,
      ref: 'subject-groups',
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
    enrolledStudentCount: {
      type: Number,
      default: 0,
    },
    credits: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isATKTSubject: {
      type: Boolean,
      default: false,
    },
    isMarksEntryLocked: {
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
