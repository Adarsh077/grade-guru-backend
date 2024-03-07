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

class SemesterService {
  async create(data) {
    const { name, departmentId } = data;

    const { semester } = await semesterDataLayer.create({
      name,
      departmentId,
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

  async updateById(semesterId, { name, departmentId }) {
    const { semester } = await semesterDataLayer.updateById(semesterId, {
      name,
      departmentId,
    });

    return { semester };
  }

  async deleteById(semesterId) {
    const { semester } = await semesterDataLayer.deleteById(semesterId);

    return { semester };
  }
}

module.exports = new SemesterService();
