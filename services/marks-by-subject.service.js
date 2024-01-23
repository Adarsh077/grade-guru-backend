/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const { marksBySubjectDataLayer } = require('../data');
const { ExamNamesEnum } = require('../enums');

class MarksBySubject {
  async findOneBy(subjectId) {
    const { marksBySubject } =
      await marksBySubjectDataLayer.findOneBy(subjectId);

    return { marksBySubject };
  }

  async updateExamsBySubjectId(subjectId, data) {
    const { exams } = data;

    const { marksBySubject } =
      await marksBySubjectDataLayer.updateExamsBySubjectId(subjectId, {
        exams,
      });

    return { marksBySubject };
  }

  async addStudents(subjectId, data) {
    let { students } = data;

    const { marksBySubject: marksBySubjectOld } =
      await marksBySubjectDataLayer.findOneBy(subjectId);

    students = students.filter(
      (studentId) =>
        !marksBySubjectOld.marksOfStudents.find(
          (studentRecord) => `${studentRecord.student}` === `${studentId}`,
        ),
    );

    const { marksBySubject } = await marksBySubjectDataLayer.addStudents(
      subjectId,
      { students },
    );

    return { marksBySubject };
  }

  async updateMarksOfStudent(subjectId, data) {
    const { marksOfStudent } = data;

    const { marksBySubject } =
      await marksBySubjectDataLayer.updateMarksOfStudent(subjectId, {
        marksOfStudent,
      });

    return { marksBySubject };
  }

  async calculateAndUpdateTotalMarks(subjectId) {
    const { marksBySubject } =
      await marksBySubjectDataLayer.findOneBy(subjectId);

    // eslint-disable-next-line no-restricted-syntax
    for (const marksOfStudent of marksBySubject.marksOfStudents) {
      if (
        marksOfStudent.marksOfStudentByExam.filter(
          (marks) => !marks.marksScored,
        ).length
      ) {
        continue;
      }

      if (
        marksOfStudent.marksOfStudentByExam.find(
          (marks) => marks.examName === ExamNamesEnum.TOT,
        )
      ) {
        continue;
      }

      let TOT = 0;
      let IATAVERAGE = null;
      const ESE = marksOfStudent.marksOfStudentByExam.find(
        (marks) => marks.examName === ExamNamesEnum.ESE,
      );

      const PROR = marksOfStudent.marksOfStudentByExam.find(
        (marks) => marks.examName === ExamNamesEnum.PROR,
      );

      const TW = marksOfStudent.marksOfStudentByExam.find(
        (marks) => marks.examName === ExamNamesEnum.TW,
      );

      if (
        marksOfStudent.marksOfStudentByExam.find(
          (marks) => marks.examName === ExamNamesEnum.IAT1,
        )
      ) {
        const IAT1 = marksOfStudent.marksOfStudentByExam.find(
          (marks) => marks.examName === ExamNamesEnum.IAT1,
        );
        const IAT2 = marksOfStudent.marksOfStudentByExam.find(
          (marks) => marks.examName === ExamNamesEnum.IAT2,
        );

        // eslint-disable-next-line no-continue
        if (!IAT1 || !IAT2) continue;
        IATAVERAGE = (IAT1.marksScored + IAT2.marksScored) / 2;
        console.log({ IATAVERAGE });
      }

      if (IATAVERAGE != null && ESE) {
        TOT = IATAVERAGE + ESE.marksScored;
      }

      if (PROR && TW) {
        TOT = PROR.marksScored + TW.marksScored;
      }

      marksOfStudent.marksOfStudentByExam.push({
        examName: ExamNamesEnum.TOT,
        marksScored: TOT,
      });

      if (IATAVERAGE != null) {
        marksOfStudent.marksOfStudentByExam.push({
          examName: ExamNamesEnum.IA,
          marksScored: IATAVERAGE,
        });
      }

      await marksBySubjectDataLayer.updateMarksOfStudent(subjectId, {
        marksOfStudent,
      });
    }

    return { marksBySubject };
  }
}

module.exports = new MarksBySubject();
