const mongoose = require('mongoose');
const { MasterListSubjectGroupModel } = require('../../models/master-list');

class MasterSubjectGroupDataLayer {
  async create(data) {
    const { name, semesterId, isATKTSubjectGroup } = data;

    const subjectGroup = await MasterListSubjectGroupModel.create({
      name,
      semester: semesterId,
      isATKTSubjectGroup,
    });

    return { subjectGroup };
  }

  async findAll({ semesterId, semesterIds }) {
    const filter = {
      isDeleted: false,
    };

    if (semesterId) {
      filter.semester = semesterId;
    }

    if (semesterIds && Array.isArray(semesterIds) && semesterIds.length) {
      filter.semester = {
        $in: semesterIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    const subjectGroups = await MasterListSubjectGroupModel.find(filter);

    return { subjectGroups };
  }

  async findById(subjectGroupId) {
    const subjectGroup =
      await MasterListSubjectGroupModel.findById(subjectGroupId);

    if (!subjectGroup || subjectGroup.isDeleted) {
      return { subjectGroup: null };
    }

    return { subjectGroup };
  }

  async updateById(subjectGroupId, { name }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    const subjectGroup = await MasterListSubjectGroupModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(`${subjectGroupId}`),
        isDeleted: false,
      },
      { $set: updateData },
      { new: true },
    );

    return { subjectGroup };
  }

  async deleteById(subjectGroupId) {
    const subjectGroup = await MasterListSubjectGroupModel.findByIdAndUpdate(
      subjectGroupId,
      { isDeleted: true },
      { new: true },
    );

    return { subjectGroup };
  }
}

module.exports = new MasterSubjectGroupDataLayer();
