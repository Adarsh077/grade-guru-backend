/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const { semesterDataLayer } = require('../data');
const {
  masterSemesterDataLayer,
  masterSubjectDataLayer,
} = require('../data/master-list');
const { AppError } = require('../utils');
const subjectService = require('./subject.service');
const studentService = require('./student.service');
const { StudentTypeEnum } = require('../enums');

class SemesterService {
  async create(data) {
    const { name, departmentId, number } = data;

    const { semester } = await semesterDataLayer.create({
      name,
      departmentId,
      number,
    });

    return { semester };
  }

  async createSemesterFromMasterSemester(data) {
    const { masterSemesterId, departmentId } = data;

    const { semester: masterSemester } =
      await masterSemesterDataLayer.findById(masterSemesterId);

    const { semester } = await semesterDataLayer.create({
      name: masterSemester.name,
      departmentId: departmentId,
      number: masterSemester.number,
    });

    const { subjects: masterSubjects } = await masterSubjectDataLayer.findAll({
      semesterId: masterSemester._id,
    });

    for (const masterSubject of masterSubjects) {
      await subjectService.createSubjectFromMasterSubject({
        masterSubjectId: masterSubject._id,
        semesterId: semester._id,
      });
    }

    return { semester };
  }

  async findAll({ departmentId, departmentIds }) {
    const { semesters } = await semesterDataLayer.findAll({
      departmentId,
      departmentIds,
    });
    return { semesters };
  }

  async findById(semesterId) {
    const { semester } = await semesterDataLayer.findById(semesterId);

    if (!semester) {
      throw new AppError({ message: 'Semester not found!' }, 404);
    }

    return { semester };
  }

  async updateById(semesterId, { name, departmentId, number }) {
    const { semester } = await semesterDataLayer.updateById(semesterId, {
      name,
      departmentId,
      number,
    });

    return { semester };
  }

  async deleteById(semesterId) {
    const { semester } = await semesterDataLayer.deleteById(semesterId);

    return { semester };
  }

  async findRegisteredStudents(semesterId) {
    const { semester } = await semesterDataLayer.findById(semesterId);

    const persuingYearBySemester = Math.ceil(semester.number / 2);
    const regularBatchYear = new Date().getFullYear() - persuingYearBySemester;
    const dseBatchYear = regularBatchYear + 1;

    const { students: regularStudents } = await studentService.find({
      admissionYear: regularBatchYear,
      departmentId: semester.department,
      studentType: StudentTypeEnum.REGULAR,
    });

    const { students: dseStudents } = await studentService.find({
      admissionYear: dseBatchYear,
      departmentId: semester.department,
      studentType: StudentTypeEnum.DSE,
    });

    const students = [
      ...regularStudents.map((student) => ({ name: student.name })),
      ...dseStudents.map((student) => ({ name: student.name })),
    ];

    return { students };
  }
}

module.exports = new SemesterService();
