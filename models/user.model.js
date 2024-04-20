const mongoose = require('mongoose');
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin,
} = require('@casl/mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

UserSchema.plugin(accessibleRecordsPlugin);
UserSchema.plugin(accessibleFieldsPlugin);

module.exports = mongoose.model('users', UserSchema);
