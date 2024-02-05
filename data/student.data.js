const mongoose = require('mongoose');
const { StudentsModel } = require('../models');

class StudentDataLayer {
  async create(data) {
    const { name, email, studentType, admissionYear } = data;

    const student = await StudentsModel.create({
      name,
      email,
      studentType,
      admissionYear,
    });

    return { student };
  }

  async find({ admissionYear }) {
    const filter = { isDeleted: false };
    if (admissionYear) {
      filter.admissionYear = admissionYear;
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
