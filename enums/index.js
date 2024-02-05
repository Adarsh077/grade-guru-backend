const ExamNamesEnum = {
  ESE: 'ESE',
  IAT1: 'IAT1',
  IAT2: 'IAT2',
  PROR: 'PR OR',
  TW: 'TW',

  // NOTE: used internally for result pdf generation
  IA: 'IA',
  TOT: 'TOT',
};

const SubjectTypeEnum = {
  WRITTEN: 'WRITTEN',
  LAB: 'LAB',
};

const StudentTypeEnum = {
  REGULAR: 'REGULAR',
  DSE: 'DSE',
};

module.exports = { ExamNamesEnum, SubjectTypeEnum, StudentTypeEnum };
