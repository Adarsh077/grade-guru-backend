const { ExamNamesEnum } = require('../../enums');

class ResultUtilsService {
  getMarkOTotal(subjects) {
    let marksOTotal = 0;

    for (const subject of subjects) {
      const TOTExams = subject.exams.find(
        (exam) => exam.examName === ExamNamesEnum.TOT,
      );

      if (TOTExams) marksOTotal += TOTExams.marksO;
    }

    return marksOTotal;
  }

  getCreditsTotal(subjects) {
    let creditsTotal = 0;

    for (const subject of subjects) {
      if (subject.credits) creditsTotal += subject.credits;
    }

    return creditsTotal;
  }

  getGPCTotal(subjects) {
    let gpcTotal = 0;

    for (const subject of subjects) {
      if (subject.gpc) gpcTotal += subject.gpc;
    }

    return gpcTotal;
  }

  /**
   * @example
   * roundUpToTwoDecimals(5.608695652) //  5.61
   * roundUpToTwoDecimals(6.363636364) //  6.36
   */
  roundUpToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
  }
}

module.exports = new ResultUtilsService();
