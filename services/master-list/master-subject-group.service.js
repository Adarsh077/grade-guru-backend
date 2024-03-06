const { masterSubjectDataLayer } = require('../../data/master-list');
const { AppError } = require('../../utils');

class MasterSubjectService {
  async create(data) {
    const { name, semesterId, staffId, code, subjectType } = data;

    const { subject } = await masterSubjectDataLayer.create({
      name,
      semesterId,
      staffId,
      code,
      subjectType,
    });

    return { subject };
  }

  async findAll({ semesterId, staffId, semesterIds }) {
    const { subjects } = await masterSubjectDataLayer.findAll({
      semesterId,
      staffId,
      semesterIds,
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
