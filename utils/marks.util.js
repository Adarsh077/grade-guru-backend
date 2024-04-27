const { ExamNamesEnum } = require('../enums');

const maxMarksByExamName = {
  [ExamNamesEnum.ESE]: 80,
  [ExamNamesEnum.IA]: 20,
  [ExamNamesEnum.IAT1]: 20,
  [ExamNamesEnum.IAT2]: 20,
  [ExamNamesEnum.PROR]: 25,
  [ExamNamesEnum.TW]: 25,
  [ExamNamesEnum.TOT]: 100,
};

const minMarksByExamName = {
  [ExamNamesEnum.ESE]: 32,
  [ExamNamesEnum.IA]: 8,
  [ExamNamesEnum.IAT1]: 8,
  [ExamNamesEnum.IAT2]: 8,
  [ExamNamesEnum.PROR]: 10,
  [ExamNamesEnum.TW]: 10,
  [ExamNamesEnum.TOT]: 40,
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

const gradeByMarksAndExam = (maxMarks, marksScored) => {
  if (!maxMarks) return '';
  const percantage = (marksScored / maxMarks) * 100;

  return gradeByPercentage(percantage);
};

const gradePointByGrade = (grade) => {
  const gradePointsByGrade = {
    O: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
    P: 4,
    F: 0,
  };

  return gradePointsByGrade[grade] || 0;
};

module.exports = {
  gradeByMarksAndExam,
  gradePointByGrade,
  maxMarksByExamName,
  minMarksByExamName,
};
