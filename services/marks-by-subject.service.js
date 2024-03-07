const { marksBySubjectDataLayer } = require('../data');

class SubjectService {
  async enterMarksFor(data) {
    const { subjectId, studentId, examName, marksScored } = data;

    const { marksBySubject } = await marksBySubjectDataLayer.enterMarksFor({
      subjectId,
      studentId,
      examName,
      marksScored,
    });

    return { marksBySubject };
  }

  async getMarksBySubjectId(data) {
    const { subjectId } = data;

    const { marksBySubject } =
      await marksBySubjectDataLayer.getMarksBySubjectId({
        subjectId,
      });

    return { marksBySubject };
  }
}

module.exports = new SubjectService();
