const { masterSubjectDataLayer } = require('../../data/master-list');
const { AppError } = require('../../utils');

class MasterSubjectService {
  async create(data) {
    const {
      name,
      subjectGroupId,
      staffId,
      code,
      subjectType,
      isATKTSubject,
      credits,
    } = data;

    const { subject } = await masterSubjectDataLayer.create({
      name,
      subjectGroupId,
      staffId,
      code,
      subjectType,
      isATKTSubject,
      credits,
    });

    return { subject };
  }

  async findAll({ subjectGroupId, staffId, subjectGroupIds }) {
    const { subjects } = await masterSubjectDataLayer.findAll({
      subjectGroupId,
      staffId,
      subjectGroupIds,
    });
    return { subjects };
  }

  async findById(subjectId) {
    const { subject } = await masterSubjectDataLayer.findById(subjectId);

    if (!subject) {
      throw new AppError({ message: 'Subject not found!' }, 404);
    }

    return { subject };
  }

  async updateById(subjectId, { name, staffId, code, subjectType }) {
    const { subject } = await masterSubjectDataLayer.updateById(subjectId, {
      name,
      staffId,
      code,
      subjectType,
    });

    return { subject };
  }

  async deleteById(subjectId) {
    const { subject } = await masterSubjectDataLayer.deleteById(subjectId);

    return { subject };
  }
}

module.exports = new MasterSubjectService();
