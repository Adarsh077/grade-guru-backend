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

const gradeByPercentage = (percentage) => {
  if (percentage >= 80) {
    return 'O';
  }

  if (percentage >= 75 && percentage < 80) {
    return 'A';
  }

  if (percentage >= 70 && percentage < 75) {
    return 'B';
  }

  if (percentage >= 60 && percentage < 70) {
    return 'C';
  }

  if (percentage >= 50 && percentage < 60) {
    return 'D';
  }

  if (percentage >= 45 && percentage < 50) {
    return 'E';
  }

  if (percentage >= 40 && percentage < 45) {
    return 'P';
  }

  if (percentage < 40) {
    return 'F';
  }

  return '';
};

exports.gradeByPercentage = gradeByPercentage;

exports.gradeByMarksAndExam = (examName, marksScored) => {
  const maxMarks = maxMarksByExamName[examName];
  if (!maxMarks) return '';

  const percantage = (marksScored / maxMarks) * 100;

  return gradeByPercentage(percantage);
};
