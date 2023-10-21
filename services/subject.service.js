const { subjectDataLayer } = require('../data');
const { AppError } = require('../utils');

class SubjectService {
  async create(data) {
    const { name, semesterId, staffId } = data;

    const { subject } = await subjectDataLayer.create({
      name,
      semesterId,
      staffId,
    });

    return { subject };
  }

  async findAll({ semesterId, staffId, semesterIds }) {
    const { subjects } = await subjectDataLayer.findAll({
      semesterId,
      staffId,
      semesterIds,
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
