const { subjectGroupDataLayer } = require('../data');
const { AppError } = require('../utils');

class SubjectService {
  async create(data) {
    const { name, semesterId } = data;

    const { subjectGroup } = await subjectGroupDataLayer.create({
      name,
      semesterId,
    });

    return { subjectGroup };
  }

  async findAll({ semesterId, semesterIds }) {
    const { subjectGroups } = await subjectGroupDataLayer.findAll({
      semesterId,
      semesterIds,
    });
    return { subjectGroups };
  }

  async findById(subjectGroupId) {
    const { subjectGroup } =
      await subjectGroupDataLayer.findById(subjectGroupId);

    if (!subjectGroup) {
      throw new AppError({ message: 'Subject Group not found!' }, 404);
    }

    return { subjectGroup };
  }

  async updateById(subjectGroupId, { name }) {
    const { subjectGroup } = await subjectGroupDataLayer.updateById(
      subjectGroupId,
      {
        name,
      },
    );

    return { subjectGroup };
  }

  async deleteById(subjectGroupId) {
    const { subjectGroup } =
      await subjectGroupDataLayer.deleteById(subjectGroupId);

    return { subjectGroup };
  }
}

module.exports = new SubjectService();
