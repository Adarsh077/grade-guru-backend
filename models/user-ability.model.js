const mongoose = require('mongoose');

const UserAbilitySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    statements: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('user-abilities', UserAbilitySchema);
