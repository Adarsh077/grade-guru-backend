const mongoose = require('mongoose');
const { SemesterModel } = require('../models');

class SemesterDataLayer {
  async create(data) {
    const { name, number, departmentId } = data;

    const semester = await SemesterModel.create({
      name,
      number,
      department: departmentId,
    });

    return { semester };
  }

  async findAll({ departmentId, departmentIds }) {
    const filter = {
      isDeleted: false,
    };

    if (departmentId) {
      filter.department = departmentId;
    }

    if (departmentIds && Array.isArray(departmentIds) && departmentIds.length) {
      filter.department = {
        $in: departmentIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
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
