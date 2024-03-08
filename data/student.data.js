const mongoose = require('mongoose');
const { StudentsModel } = require('../models');

class StudentDataLayer {
  async create(data) {
    const { name, email, studentType, admissionYear, departmentId } = data;

    const student = await StudentsModel.create({
      name,
      email,
      studentType,
      admissionYear,
      department: departmentId,
    });

    return { student };
  }

  async find({ admissionYear, departmentId, studentType }) {
    const filter = { isDeleted: false };
    if (admissionYear) {
      filter.admissionYear = admissionYear;
    }
    if (departmentId) {
      filter.department = departmentId;
    }
    if (studentType) {
      filter.studentType = studentType;
    }

    const students = await StudentsModel.find(filter);

    return { students };
  }

  async update(studentId, { name, email }) {
    const updateObject = {};
    if (name) {
      updateObject.name = name;
    }
    if (email) {
      updateObject.email = email;
    }

    const student = await StudentsModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(studentId),
        isDeleted: false,
      },
      updateObject,
      { new: true },
    );

    return { student };
  }

  async delete(studentId) {
    const student = await StudentsModel.findByIdAndUpdate(
      studentId,
      { $set: { isDeleted: true } },
      { new: true },
    );

    return { student };
  }
}

module.exports = new StudentDataLayer();
