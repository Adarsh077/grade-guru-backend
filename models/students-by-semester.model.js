const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // seatNo: {
  //   type: String,
  //   required: true,
  //   default: null,
  // }
});

const StudentsBySemesterSchema = mongoose.Schema(
  {
    semester: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'semesters',
    },
    students: {
      type: [StudentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

StudentsBySemesterSchema.plugin(accessibleRecordsPlugin);
StudentsBySemesterSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model(
  'students-by-semesters',
  StudentsBySemesterSchema,
);
