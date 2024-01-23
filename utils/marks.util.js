const { ExamNamesEnum } = require('../enums');

const maxMarksByExamName = {
  [ExamNamesEnum.ESE]: 80,
  [ExamNamesEnum.IA]: 20,
  [ExamNamesEnum.IAT1]: 20,
  [ExamNamesEnum.IAT2]: 20,
  [ExamNamesEnum.PROR]: 25,
  [ExamNamesEnum.TW]: 25,
  [ExamNamesEnum.TOT]: 25,
};

exports.gradeByMarksAndExam = (examName, marksScored) => {
  const maxMarks = maxMarksByExamName[examName];
  if (!maxMarks) return '';

  const percantage = (marksScored / maxMarks) * 100;

  if (percantage >= 80) {
    return 'O';
  }

  if (percantage >= 75 && percantage < 80) {
    return 'A';
  }

  if (percantage >= 70 && percantage < 75) {
    return 'B';
  }

  if (percantage >= 60 && percantage < 70) {
    return 'C';
  }

  if (percantage >= 50 && percantage < 60) {
    return 'D';
  }

  if (percantage >= 45 && percantage < 50) {
    return 'E';
  }

  if (percantage >= 40 && percantage < 45) {
    return 'P';
  }

  if (percantage < 40) {
    return 'F';
  }

  return '';
};
