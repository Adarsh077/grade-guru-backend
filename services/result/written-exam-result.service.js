const { ExamNamesEnum, SubjectTypeEnum } = require('../../enums');
const { marksUtils } = require('../../utils');
const { maxMarksByExamName } = require('../../utils/marks.util');

class WrittenExamResultService {
  async generateWrittenExamResult(marksBySubject) {
    const totalMarks = this.calculateWrittenSubjectTotal(marksBySubject);

    const result = {
      subject: marksBySubject._id,
      subjectType: marksBySubject.subjectType,
      subjectCode: marksBySubject.code,
      credits: marksBySubject.credits,
      exams: [
        {
          examName: ExamNamesEnum.ESE,
          marksO: totalMarks.ESE,
        },
        {
          examName: ExamNamesEnum.IA,
          marksO: totalMarks.IA,
        },
        {
          examName: ExamNamesEnum.TOT,
          marksO: totalMarks.TOT,
        },
      ],
    };

    if (marksBySubject.subjectType === SubjectTypeEnum.WRITTEN_TW) {
      result.exams.push({
        examName: ExamNamesEnum.TW,
        marksO: totalMarks.TW,
      });
    }
    return result;
  }

  calculateGradeCreditsAndGradePointCredits(marksBySubject) {
    let { credits } = marksBySubject;

    const ESEMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.ESE,
    ).marksOAfterGrace;

    const IAMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.IA,
    ).marksOAfterGrace;

    const TWMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.TW,
    )
      ? marksBySubject.exams.find((exam) => exam.examName === ExamNamesEnum.TW)
          .marksOAfterGrace
      : null;

    const TOTMarks = marksBySubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.TOT,
    ).marksOAfterGrace;

    if (ESEMarks < 32 || IAMarks < 8) {
      credits = 0;
    }

    const ESEGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.ESE],
      ESEMarks,
    );
    const IAGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.IA],
      IAMarks,
    );

    const TWGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.TW],
      TWMarks,
    );

    let TOTGrade = marksUtils.gradeByMarksAndExam(
      maxMarksByExamName[ExamNamesEnum.IA] +
        maxMarksByExamName[ExamNamesEnum.ESE],
      TOTMarks,
    );

    if (
      [
        ...marksBySubject.exams.find(
          (exam) => exam.examName === ExamNamesEnum.ESE,
        ).symbols,
        marksBySubject.exams.find((exam) => exam.examName === ExamNamesEnum.IA)
          .symbols,
      ].includes('F')
    ) {
      TOTGrade = 'F';
    }

    const gp = marksUtils.gradePointByGrade(TOTGrade);
    marksBySubject.exams = marksBySubject.exams.map((exam) => {
      if (exam.examName === ExamNamesEnum.ESE) {
        return { ...exam, grade: ESEGrade };
      }

      if (exam.examName === ExamNamesEnum.IA) {
        return { ...exam, grade: IAGrade };
      }

      if (exam.examName === ExamNamesEnum.TW) {
        return {
          ...exam,
          grade: TWGrade,
          credits: TWGrade !== 'F' ? 1 : 0,
          gpc:
            marksUtils.gradePointByGrade(TWGrade) * (TWGrade !== 'F' ? 1 : 0),
        };
      }

      if (exam.examName === ExamNamesEnum.TOT) {
        return {
          ...exam,
          grade: TOTGrade,
          credits: credits,
          gpc: gp * credits,
        };
      }

      return exam;
    });

    return {
      ...marksBySubject,
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

    if (marksBySubject.subjectType === SubjectTypeEnum.WRITTEN_TW) {
      totalMarks[ExamNamesEnum.TW] = marksBySubject.exams.find(
        (exam) => exam.examName === ExamNamesEnum.TW,
      ).marksScored;
    }

    return totalMarks;
  }
}

module.exports = new WrittenExamResultService();
