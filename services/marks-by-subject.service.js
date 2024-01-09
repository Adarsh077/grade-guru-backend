const { marksBySubjectDataLayer } = require('../data');

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
}

module.exports = new MarksBySubject();
