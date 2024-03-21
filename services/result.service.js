const { SubjectTypeEnum, ExamNamesEnum } = require('../enums');
const { marksUtils } = require('../utils');

class ResultService {
  async generateResult(marksByStudent) {
    const marks = [];

    for (const marksBySubject of marksByStudent.subjects) {
      if (marksBySubject.subjectType === SubjectTypeEnum.WRITTEN) {
        const resultBySubject =
          await this.generateWrittenExamResult(marksBySubject);
        marks.push(resultBySubject);
      } else if (marksBySubject.subjectType === SubjectTypeEnum.LAB) {
        this.calculateLabSubjectTotal(marksBySubject);
      }
    }

    console.log(marks);
  }

  // * WRITTTEN RESULT CALCULATION
  async generateWrittenExamResult(marksBySubject) {
    const totalMarks = this.calculateWrittenSubjectTotal(marksBySubject);

    return {
      subject: marksBySubject._id,
      subjectCode: marksBySubject.code,
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
      ],
    };
  }

  calculateWrittenSubjectTotal(marksBySubject) {
    const totalMarks = {
      [ExamNamesEnum.IA]: 0,
      [ExamNamesEnum.ESE]: 0,
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

    return totalMarks;
  }

  // * LAB RESULT CALCULATION
  calculateLabSubjectTotal(marksBySubject) {
    console.log(marksBySubject);
  }
}

module.exports = new ResultService();
