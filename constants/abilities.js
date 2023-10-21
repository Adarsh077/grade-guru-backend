const userRoles = require('./user-roles');
const caslEnum = require('../casl/casl.enum');

const abilities = {
  [userRoles.ADMIN]: [
    {
      inverted: false,
      subject: [caslEnum.subjects.all],
      action: [caslEnum.actions.manage],
      fields: [],
    },
  ],
  [userRoles.HOD]: [
    {
      inverted: false,
      subject: [caslEnum.subjects.batches],
      action: [caslEnum.actions.read],
      fields: [],
    },
    {
      inverted: false,
      subject: [caslEnum.subjects.departments],
      action: [caslEnum.actions.read],
      conditions: {
        hod: {
          $in: ['$userId'],
        },
      },
      fields: [],
    },
    {
      inverted: false,
      subject: [caslEnum.subjects.semesters],
      action: [caslEnum.actions.manage],
      fields: [],
    },
    {
      inverted: false,
      subject: [caslEnum.subjects.subjects],
      action: [caslEnum.actions.manage],
      fields: [],
    },
    {
      inverted: false,
      subject: [caslEnum.subjects.users],
      action: [
        caslEnum.actions.create,
        caslEnum.actions.read,
        caslEnum.actions.update,
      ],
      fields: [],
    },
  ],
  [userRoles.STAFF]: [
    {
      inverted: false,
      subject: [caslEnum.subjects.batches],
      action: [caslEnum.actions.read],
      fields: [],
    },
    {
      inverted: false,
      subject: [caslEnum.subjects.subjects],
      action: [caslEnum.actions.read],
      conditions: {
        staff: {
          $in: ['$userId'],
        },
      },
      fields: [],
    },
  ],
};

module.exports = abilities;
