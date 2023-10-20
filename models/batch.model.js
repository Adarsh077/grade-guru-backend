const mongoose = require('mongoose');

const BatchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('batches', BatchSchema);
