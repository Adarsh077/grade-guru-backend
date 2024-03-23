const { ExamNamesEnum } = require('../../enums');
const { marksUtils } = require('../../utils');

class WrittenExamResultService {
  // * Written exam calculation
  async generateWrittenExamResult(marksBySubject) {
    const totalMarks = this.calculateWrittenSubjectTotal(marksBySubject);

    let { credits } = marksBySubject;

    if (totalMarks.ESE < 32) {
      credits = 0;
    }

    const totalGrade = marksUtils.gradeByMarksAndExam(
      ExamNamesEnum.TOT,
      totalMarks.TOT,
    );
    const gp = marksUtils.gradePointByGrade(totalGrade);

    return {
      subject: marksBySubject._id,
      subjectCode: marksBySubject.code,
      credits,
      gpc: gp * credits,
      exams: [
        {
          examName: ExamNamesEnum.ESE,
          marksO: totalMarks.ESE,
          grade: marksUtils.gradeByMarksAndExam(
            ExamNamesEnum.ESE,
            totalMarks.ESE,
          ),
        },
        {
          examName: ExamNamesEnum.IA,
          marksO: totalMarks.IA,
          grade: marksUtils.gradeByMarksAndExam(
            ExamNamesEnum.IA,
            totalMarks.IA,
          ),
        },
        {
          examName: ExamNamesEnum.TOT,
          marksO: totalMarks.TOT,
          grade: marksUtils.gradeByMarksAndExam(
            ExamNamesEnum.TOT,
            totalMarks.TOT,
          ),
        },
      ],
    };
  }

  calculateWrittenSubjectTotal(marksBySubject) {
    const totalMarks = {
      [ExamNamesEnum.IA]: 0,
      [ExamNamesEnum.ESE]: 0,
      [ExamNamesEnum.TOT]: 0,
    };

    const eseMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.ESE,
    );

    if (eseMarks && eseMarks.marksScored) {
      totalMarks[ExamNamesEnum.ESE] = eseMarks.marksScored;
    }

    const iat1Marks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.IAT1,
    );

    const iat2Marks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.IAT2,
    );

    if (iat1Marks && iat2Marks) {
      totalMarks[ExamNamesEnum.IA] = Math.ceil(
        (iat1Marks.marksScored + iat2Marks.marksScored) / 2,
      );
    }

    totalMarks[ExamNamesEnum.TOT] =
      totalMarks[ExamNamesEnum.IA] + totalMarks[ExamNamesEnum.ESE];

    return totalMarks;
  }
}

module.exports = new WrittenExamResultService();
