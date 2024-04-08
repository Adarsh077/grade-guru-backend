const { masterSubjectGroupDataLayer } = require('../../data/master-list');
const { AppError } = require('../../utils');

class MasterSubjectService {
  async create(data) {
    const { name, semesterId, isATKTSubjectGroup } = data;

    const { subjectGroup } = await masterSubjectGroupDataLayer.create({
      name,
      semesterId,
      isATKTSubjectGroup,
    });

    return { subjectGroup };
  }

  async findAll({ semesterId, semesterIds }) {
    const { subjectGroups } = await masterSubjectGroupDataLayer.findAll({
      semesterId,
      semesterIds,
    });
    return { subjectGroups };
  }

  async findById(subjectGroupId) {
    const { subjectGroup } =
      await masterSubjectGroupDataLayer.findById(subjectGroupId);

    if (!subjectGroup) {
      throw new AppError({ message: 'Subject Group not found!' }, 404);
    }

    return { subjectGroup };
  }

  async updateById(subjectGroupId, { name }) {
    const { subjectGroup } = await masterSubjectGroupDataLayer.updateById(
      subjectGroupId,
      {
        name,
      },
    );

    return { subjectGroup };
  }

  async deleteById(subjectGroupId) {
    const { subjectGroup } =
      await masterSubjectGroupDataLayer.deleteById(subjectGroupId);

    return { subjectGroup };
  }
}

module.exports = new MasterSubjectService();
