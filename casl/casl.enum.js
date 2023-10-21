const caslActions = {
  create: 'create',
  read: 'read',
  update: 'update',
  manage: 'manage',
  delete: 'delete',
};

const caslSubjects = {
  all: 'all',
  batches: 'batches',
  departments: 'departments',
  semesters: 'semesters',
  subjects: 'subjects',
  users: 'users',
};

const caslEffects = {
  allow: 'allow',
  deny: 'deny',
};

module.exports = {
  actions: caslActions,
  effects: caslEffects,
  subjects: caslSubjects,
};
