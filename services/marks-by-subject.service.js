const { marksBySubjectDataLayer, subjectDataLayer } = require('../data');
const { AppError } = require('../utils');

class MarksBySubjectService {
  async enterMarksFor(data) {
    const {
      subjectId,
      studentId,
      examName,
      marksScored,
      hasParticipatedInNss,
    } = data;

    const { subject } = await subjectDataLayer.findById(subjectId);

    if (subject.isMarksEntryLocked) {
      throw new AppError({ message: 'Marks Entry Locked!' });
    }

    const { marksBySubject } = await marksBySubjectDataLayer.enterMarksFor({
      subjectId,
      studentId,
      examName,
      marksScored,
      hasParticipatedInNss,
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

  async createMarksEntryForEnrolledStudents(data) {
    const { studentIds, subjectId } = data;

    const { marksBySubject } =
      await marksBySubjectDataLayer.createMarksEntryForEnrolledStudents({
        studentIds,
        subjectId,
      });

    return { marksBySubject };
  }

  async updateSeatNo(data) {
    const { subjectId, studentId, iatSeatNo, eseSeatNo } = data;

    const { marksBySubject } = await marksBySubjectDataLayer.updateSeatNo({
      subjectId,
      studentId,
      iatSeatNo,
      eseSeatNo,
    });

    return { marksBySubject };
  }
}

module.exports = new MarksBySubjectService();
