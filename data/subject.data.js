const mongoose = require('mongoose');
const { SubjectModel } = require('../models');

class SubjectDataLayer {
  async create(data) {
    const {
      name,
      subjectGroupId,
      staffId,
      code,
      subjectType,
      credits,
      isATKTSubject,
      isMarksEntryLocked,
    } = data;

    const subject = await SubjectModel.create({
      name,
      subjectGroup: subjectGroupId,
      staff: staffId,
      code,
      subjectType,
      credits,
      isATKTSubject,
      isMarksEntryLocked,
    });

    return { subject };
  }

  async findAll({ subjectGroupId, staffId, subjectGroupIds, subjectIds }) {
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

    if (subjectIds && Array.isArray(subjectIds) && subjectIds.length) {
      filter._id = {
        $in: subjectIds.map((id) => new mongoose.Types.ObjectId(id)),
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

  async updateById(
    subjectId,
    { name, staffId, subjectType, enrolledStudentCount, isMarksEntryLocked },
  ) {
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

    if (enrolledStudentCount) {
      updateData.enrolledStudentCount = enrolledStudentCount;
    }
    if (typeof isMarksEntryLocked === 'boolean') {
      updateData.isMarksEntryLocked = isMarksEntryLocked;
    }

    const subject = await SubjectModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(`${subjectId}`), isDeleted: false },
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
