const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    semesterId: {
      type: mongoose.Types.ObjectId,
      ref: 'semesters',
    },
    data: {},
  },
  { timestamps: true },
);

module.exports = mongoose.model('results', ResultSchema);
