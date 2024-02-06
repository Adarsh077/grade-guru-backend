const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const BatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

BatchSchema.plugin(accessibleRecordsPlugin);
BatchSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('batches', BatchSchema);
