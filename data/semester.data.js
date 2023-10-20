const mongoose = require('mongoose');
const { SemesterModel } = require('../models');

class SemesterDataLayer {
  async create(data) {
    const { name, departmentId } = data;

    const semester = await SemesterModel.create({
      name,
      department: departmentId,
    });

    return { semester };
  }

  async findAll({ departmentId }) {
    const filter = {
      isDeleted: false,
    };

    if (departmentId) {
      filter.department = departmentId;
    }
    const semesters = await SemesterModel.find(filter);

    return { semesters };
  }

  async findById(semesterId) {
    const semester = await SemesterModel.findById(semesterId);

    if (semester.isDeleted) {
      return { semester: null };
    }

    return { semester };
  }

  async updateById(semesterId, { name, departmentId }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (departmentId) {
      updateData.department = departmentId;
    }

    const semester = await SemesterModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(semesterId), isDeleted: false },
      {
        $set: updateData,
      },
      { new: true },
    );

    return { semester };
  }

  async deleteById(semesterId) {
    const semester = await SemesterModel.findByIdAndUpdate(
      semesterId,
      { isDeleted: true },
      { new: true },
    );

    return { semester };
  }
}

module.exports = new SemesterDataLayer();
