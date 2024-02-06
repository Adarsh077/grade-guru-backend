const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const StudentSchema = new mongoose.Schema({
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

const StudentsBySemesterSchema = new mongoose.Schema(
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
