const ExamNamesEnum = {
  ESE: 'ESE',
  IAT1: 'IAT1',
  IAT2: 'IAT2',
  PROR: 'PR_OR',
  TW: 'TW',

  // NOTE: used internally for result pdf generation
  IA: 'IA',
  TOT: 'TOT',
};

const SubjectTypeEnum = {
  WRITTEN_TW: 'WRITTEN_TW',
  WRITTEN: 'WRITTEN',
  LAB: 'LAB',
};

const ExamsBySubjectType = {
  [SubjectTypeEnum.WRITTEN]: [
    ExamNamesEnum.IAT1,
    ExamNamesEnum.IAT2,
    ExamNamesEnum.ESE,
  ],
  [SubjectTypeEnum.WRITTEN_TW]: [
    ExamNamesEnum.IAT1,
    ExamNamesEnum.IAT2,
    ExamNamesEnum.TW,
    ExamNamesEnum.ESE,
  ],
  [SubjectTypeEnum.LAB]: [ExamNamesEnum.PROR, ExamNamesEnum.TW],
};

const StudentTypeEnum = {
  REGULAR: 'REGULAR',
  DSE: 'DSE',
};

const StudentGenderEnum = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

const FinalResultEnum = {
  P: 'P',
  F: 'F',
  'P#': 'P#',
};

const ResultBySemesterStatusEnum = {
  PASS: 'PASS',
  ATKT: 'ATKT',
  DROP: 'DROP',
};
const StudentStatusEnum = {
  PASS: 'PASS',
  ATKT: 'ATKT',
  DROP: 'DROP',
};

module.exports = {
  ExamNamesEnum,
  SubjectTypeEnum,
  StudentTypeEnum,
  ExamsBySubjectType,
  FinalResultEnum,
  ResultBySemesterStatusEnum,
  StudentGenderEnum,
  StudentStatusEnum,
};
