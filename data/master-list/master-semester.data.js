const mongoose = require('mongoose');
const { MasterListSemesterModel } = require('../../models/master-list');

class SemesterDataLayer {
  async create(data) {
    const { name, number, departmentId } = data;

    const semester = await MasterListSemesterModel.create({
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

    const semesters = await MasterListSemesterModel.find(filter);

    return { semesters };
  }

  async findById(semesterId) {
    const semester = await MasterListSemesterModel.findById(semesterId);

    if (semester.isDeleted) {
      return { semester: null };
    }

    return { semester };
  }

  async updateById(semesterId, { name, number, departmentId }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (number) {
      updateData.number = number;
    }
    if (departmentId) {
      updateData.department = departmentId;
    }

    const semester = await MasterListSemesterModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(semesterId), isDeleted: false },
      { $set: updateData },
      { new: true },
    );

    return { semester };
  }

  async deleteById(semesterId) {
    const semester = await MasterListSemesterModel.findByIdAndUpdate(
      semesterId,
      { isDeleted: true },
      { new: true },
    );

    return { semester };
  }
}

module.exports = new SemesterDataLayer();
