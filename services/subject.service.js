const { subjectDataLayer, marksBySubjectDataLayer } = require('../data');
const { masterSubjectDataLayer } = require('../data/master-list');
const { AppError } = require('../utils');

class SubjectService {
  async create(data) {
    const {
      name,
      subjectGroupId,
      staffId,
      code,
      credits,
      subjectType,
      isATKTSubject,
    } = data;

    const { subject } = await subjectDataLayer.create({
      name,
      subjectGroupId,
      staffId,
      code,
      credits,
      subjectType,
      isATKTSubject,
    });

    return { subject };
  }

  // TODO: Update master list services
  async createSubjectFromMasterSubject({ masterSubjectId, semesterId }) {
    const { subject: masterSubject } =
      await masterSubjectDataLayer.findById(masterSubjectId);

    const { subject } = await subjectDataLayer.create({
      name: masterSubject.name,
      semesterId,
      staffId: masterSubject.staff,
      code: masterSubject.code,
    });

    return { subject };
  }

  async findAll({ subjectGroupId, staffId, subjectGroupIds }) {
    const { subjects } = await subjectDataLayer.findAll({
      subjectGroupId,
      staffId,
      subjectGroupIds,
    });
    return { subjects };
  }

  async findById(subjectId) {
    const { subject } = await subjectDataLayer.findById(subjectId);

    if (!subject) {
      throw new AppError({ message: 'Subject not found!' }, 404);
    }

    return { subject };
  }

  async updateById(subjectId, { name, staffId }) {
    const { subject } = await subjectDataLayer.updateById(subjectId, {
      name,
      staffId,
    });

    return { subject };
  }

  async deleteById(subjectId) {
    const { subject } = await subjectDataLayer.deleteById(subjectId);

    return { subject };
  }

  async enrollStudent(subjectId, { studentId }) {
    const { marksBySubject } =
      await marksBySubjectDataLayer.createMarksEntryForEnrolledStudents({
        studentIds: [studentId],
        subjectId,
      });

    await subjectDataLayer.updateById(subjectId, {
      enrolledStudentCount: marksBySubject.marks.length,
    });

    return { marksBySubject };
  }

  async unEnrollStudent(subjectId, { studentId }) {
    const { marksBySubject } =
      await marksBySubjectDataLayer.removeMarksEntryForStudent({
        studentId,
        subjectId,
      });

    await subjectDataLayer.updateById(subjectId, {
      enrolledStudentCount: marksBySubject.marks.length,
    });

    return { marksBySubject };
  }
}

module.exports = new SubjectService();
