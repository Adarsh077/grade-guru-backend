const { ExamNamesEnum } = require('../../enums');

class LabExamResultService {
  // ! TODO
  // * Lab Result Calculation
  /**
   *    subject: '65f11eecf734d2e0d873c757',
        subjectCode: 'ITCDO5012',
        credits: 3,
        gpc: 21,
        exams: [ [Object], [Object], [Object] ]
   */
  generateLabExamResult(marksBySubject) {
    console.log(marksBySubject);
    // return {
    //   subject: marksBySubject._id,
    //   subjectCode: marksBySubject.code,
    //   credits: marksBySubject.credits,
    // }
  }

  calculateLabSubjectTotal(marksBySubject) {
    const totalMarks = {
      [ExamNamesEnum.PROR]: 0,
      [ExamNamesEnum.TW]: 0,
      [ExamNamesEnum.TOT]: 0,
    };

    const prorMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.PROR,
    );

    if (prorMarks && prorMarks.marksScored) {
      totalMarks[ExamNamesEnum.PROR] = prorMarks.marksScored;
    }

    const twMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.TW,
    );

    if (twMarks && twMarks.marksScored) {
      totalMarks[ExamNamesEnum.TW] = twMarks.marksScored;
    }

    totalMarks[ExamNamesEnum.TOT] =
      totalMarks[ExamNamesEnum.IA] + totalMarks[ExamNamesEnum.ESE];

    return totalMarks;
  }
}

module.exports = new LabExamResultService();
