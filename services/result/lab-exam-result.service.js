const { ExamNamesEnum } = require('../../enums');
const { marksUtils } = require('../../utils');
const { maxMarksByExamName } = require('../../utils/marks.util');

class LabExamResultService {
  generateLabExamResult(marksBySubject) {
    const totalMarks = this.calculateLabSubjectTotal(marksBySubject);

    return {
      subject: marksBySubject._id,
      subjectCode: marksBySubject.code,
      subjectType: marksBySubject.subjectType,
      credits: marksBySubject.credits,
      exams: [
        {
          examName: ExamNamesEnum.PROR,
          marksO: totalMarks[ExamNamesEnum.PROR],
        },
        {
          examName: ExamNamesEnum.TW,
          marksO: totalMarks[ExamNamesEnum.TW],
        },
        {
          examName: ExamNamesEnum.TOT,
          marksO: totalMarks[ExamNamesEnum.TOT],
        },
      ],
    };
  }

  calculateGradeCreditsAndGradePointCredits(marksBySubject) {
    let { credits } = marksBySubject;

    const PRORMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.PROR,
    ).marksOAfterGrace;

    const TWMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.TW,
    ).marksOAfterGrace;

    const TOTMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.TOT,
    ).marksOAfterGrace;

    if (PRORMarks < 10 || TWMarks < 10) {
      credits = 0;
    }

    const PRORGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.PROR],
      PRORMarks,
    );

    const TWGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.TW],
      TWMarks,
    );

    let TOTGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.TW] +
        maxMarksByExamName[ExamNamesEnum.PROR],
      TOTMarks,
    );

    if ([PRORGrade, TWGrade].includes('F')) {
      TOTGrade = 'F';
    }

    const gp = marksUtils.gradePointByGrade(TOTGrade);

    marksBySubject.exams = marksBySubject.exams.map((exam) => {
      if (exam.examName === ExamNamesEnum.PROR) {
        return { ...exam, grade: PRORGrade };
      }

      if (exam.examName === ExamNamesEnum.TW) {
        return { ...exam, grade: TWGrade };
      }

      if (exam.examName === ExamNamesEnum.TOT) {
        return { ...exam, grade: TOTGrade };
      }

      return exam;
    });

    return {
      ...marksBySubject,
      credits: credits,
      gpc: gp * credits,
    };
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
      totalMarks[ExamNamesEnum.TW] + totalMarks[ExamNamesEnum.PROR];

    return totalMarks;
  }
}

module.exports = new LabExamResultService();
