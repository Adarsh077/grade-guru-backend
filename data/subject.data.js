const mongoose = require('mongoose');
const { SubjectModel } = require('../models');

class SubjectDataLayer {
  async create(data) {
    const { name, semesterId, staffId } = data;

    const subject = await SubjectModel.create({
      name,
      semester: semesterId,
      staff: staffId,
    });

    return { subject };
  }

  async findAll({ semesterId, staffId, semesterIds }) {
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

  async updateById(subjectId, { name, staffId }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (staffId) {
      updateData.staff = staffId;
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
