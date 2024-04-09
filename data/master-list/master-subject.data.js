const mongoose = require('mongoose');
const { MasterListSubjectModel } = require('../../models/master-list');

class MasterSubjectDataLayer {
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

    const subject = await MasterListSubjectModel.create({
      name,
      subjectGroup: subjectGroupId,
      staff: staffId,
      code,
      subjectType,
      isATKTSubject,
      credits,
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

    const subjects = await MasterListSubjectModel.find(filter).populate(
      'staff',
      '_id name',
    );

    return { subjects };
  }

  async findById(subjectId) {
    const subject = await MasterListSubjectModel.findById(subjectId);

    if (subject.isDeleted) {
      return { subject: null };
    }

    return { subject };
  }

  async updateById(subjectId, { name, staffId, code, subjectType }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (staffId) {
      updateData.staff = staffId;
    }
    if (code) {
      updateData.code = code;
    }

    if (subjectType) {
      updateData.subjectType = subjectType;
    }

    const subject = await MasterListSubjectModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(subjectId), isDeleted: false },
      {
        $set: updateData,
      },
      { new: true },
    );

    return { subject };
  }

  async deleteById(subjectId) {
    const subject = await MasterListSubjectModel.findByIdAndUpdate(
      subjectId,
      { isDeleted: true },
      { new: true },
    );

    return { subject };
  }
}

module.exports = new MasterSubjectDataLayer();
