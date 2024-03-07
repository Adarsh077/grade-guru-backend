const mongoose = require('mongoose');
const { SubjectModel } = require('../models');

class SubjectDataLayer {
  async create(data) {
    const { name, subjectGroupId, staffId, code, subjectType } = data;

    const subject = await SubjectModel.create({
      name,
      subjectGroup: subjectGroupId,
      staff: staffId,
      code,
      subjectType,
    });

    return { subject };
  }

  async findAll({ subjectGroupId, staffId, subjectGroupIds }) {
    const filter = {
      isDeleted: false,
    };

    if (subjectGroupId) {
      filter.subjectGroup = subjectGroupId;
    }

    if (
      subjectGroupIds &&
      Array.isArray(subjectGroupIds) &&
      subjectGroupIds.length
    ) {
      filter.subjectGroup = {
        $in: subjectGroupIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    if (staffId) {
      filter.staff = staffId;
    }

    const subjects = await SubjectModel.find(filter).populate(
      'staff',
      '_id name',
    );

    return { subjects };
  }

  async findById(subjectId) {
    const subject = await SubjectModel.findById(subjectId);

    if (subject.isDeleted) {
      return { subject: null };
    }

    return { subject };
  }

  async updateById(subjectId, { name, staffId, subjectType }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (staffId) {
      updateData.staff = staffId;
    }

    if (subjectType) {
      updateData.subjectType = subjectType;
    }

    const subject = await SubjectModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(subjectId), isDeleted: false },
      {
        $set: updateData,
      },
      { new: true },
    );

    return { subject };
  }

  async deleteById(subjectId) {
    const subject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      { isDeleted: true },
      { new: true },
    );

    return { subject };
  }
}

module.exports = new SubjectDataLayer();
