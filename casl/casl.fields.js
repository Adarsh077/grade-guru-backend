const caslEnum = require('./casl.enum');
const {
  BatchModel,
  DepartmentModel,
  SemesterModel,
  SubjectModel,
  UserModel,
} = require('../models');

const models = [
  {
    model: BatchModel,
    caslSubject: caslEnum.subjects.batches,
  },
  {
    model: DepartmentModel,
    caslSubject: caslEnum.subjects.departments,
  },
  {
    model: SemesterModel,
    caslSubject: caslEnum.subjects.semesters,
  },
  {
    model: SubjectModel,
    caslSubject: caslEnum.subjects.subjects,
  },
  {
    model: UserModel,
    caslSubject: caslEnum.subjects.users,
  },
];

const caslFields = {};

// eslint-disable-next-line no-restricted-syntax
for (const caslSubject of Object.values(caslEnum.subjects)) {
  const modelForCaslSubject = models.find(
    (model) => model.caslSubject === caslSubject,
  );

  if (modelForCaslSubject && modelForCaslSubject.model) {
    caslFields[caslSubject] = [
      ...Object.keys(modelForCaslSubject.model.schema.paths),
      ...Object.keys(modelForCaslSubject.model.schema.virtuals),
    ];
  }
}

module.exports = caslFields;
