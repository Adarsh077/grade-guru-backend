const { subjectDataLayer } = require('../data');
const { masterSubjectDataLayer } = require('../data/master-list');
const { AppError } = require('../utils');

class SubjectService {
  async create(data) {
    const { name, subjectGroupId, staffId, code } = data;

    const { subject } = await subjectDataLayer.create({
      name,
      subjectGroupId,
      staffId,
      code,
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
}

module.exports = new SubjectService();
