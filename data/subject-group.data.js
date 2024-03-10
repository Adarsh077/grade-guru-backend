const mongoose = require('mongoose');
const { SubjectGroupModel } = require('../models');

class SubjectGroupDataLayer {
  async create(data) {
    const { name, semesterId } = data;

    const subjectGroup = await SubjectGroupModel.create({
      name,
      semester: semesterId,
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

    const subjectGroups = await SubjectGroupModel.find(filter);

    return { subjectGroups };
  }

  async findById(subjectGroupId) {
    const subjectGroup = await SubjectGroupModel.findById(subjectGroupId);

    if (subjectGroup.isDeleted) {
      return { subject: null };
    }

    return { subjectGroup };
  }

  async updateById(subjectGroupId, { name, enrolledStudents }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (
      enrolledStudents &&
      Array.isArray(enrolledStudents) &&
      enrolledStudents.length
    ) {
      updateData.enrolledStudents = enrolledStudents;
    }

    const subjectGroup = await SubjectGroupModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(subjectGroupId), isDeleted: false },
      { $set: updateData },
      { new: true },
    );

    return { subjectGroup };
  }

  async deleteById(subjectGroupId) {
    const subjectGroup = await SubjectGroupModel.findByIdAndUpdate(
      subjectGroupId,
      { isDeleted: true },
      { new: true },
    );

    return { subjectGroup };
  }
}

module.exports = new SubjectGroupDataLayer();
