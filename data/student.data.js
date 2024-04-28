const mongoose = require('mongoose');
const { StudentsModel } = require('../models');
const { ResultBySemesterStatusEnum } = require('../enums');

class StudentDataLayer {
  async create(data) {
    const { name, email, studentType, admissionYear, departmentId, gender } =
      data;

    const student = await StudentsModel.create({
      name,
      email,
      studentType,
      admissionYear,
      department: departmentId,
      gender,
    });

    return { student };
  }

  async find({ admissionYear, departmentId, studentType, names }) {
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

    if (names) {
      filter.name = { $in: names };
    }

    const students = await StudentsModel.find(filter);

    return { students };
  }

  async findEligibleStudent(data) {
    const students = await StudentsModel.find(data);

    return { students };
  }

  async findById(studentId) {
    const filter = {
      isDeleted: false,
      _id: new mongoose.Types.ObjectId(`${studentId}`),
    };

    const student = await StudentsModel.findOne(filter);

    return { student };
  }

  async update(studentId, { name, email, status }) {
    const updateObject = {};

    if (name) {
      updateObject.name = name;
    }

    if (email) {
      updateObject.email = email;
    }
    if (status) {
      updateObject.status = status;
    }

    const student = await StudentsModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(`${studentId}`),
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

  async saveResultBySemester(data) {
    const { semesterNumber, resultId, status, batchId, studentId } = data;

    const student = await StudentsModel.findById(studentId);

    if (!student) return { student: null };

    student.resultBySemesters[`semester${semesterNumber}`] = {
      resultId,
      status,
      batch: batchId,
    };

    await student.save();
  }

  async findStudentsWithATKT(semesterNumber) {
    const students = await StudentsModel.find({
      [`resultBySemesters.semester${semesterNumber}.status`]:
        ResultBySemesterStatusEnum.ATKT,
    });

    return { students };
  }
}

module.exports = new StudentDataLayer();
