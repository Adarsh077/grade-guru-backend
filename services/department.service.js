/* eslint-disable no-restricted-syntax */
const { departmentDataLayer } = require('../data');
const {
  masterDepartmentDataLayer,
  masterSemesterDataLayer,
} = require('../data/master-list');
const { AppError } = require('../utils');
const semesterService = require('./semester.service');

class DepartmentService {
  async create(data) {
    const { name, hod, batch, ability } = data;

    const { department } = await departmentDataLayer.create({
      name,
      hod,
      batch,
      ability,
    });

    return { department };
  }

  async createDepartmentFromMaster(data) {
    const { masterDeparmentId, batch, ability } = data;

    const { department: masterDepartment } =
      await masterDepartmentDataLayer.findById(masterDeparmentId);

    const { department } = await departmentDataLayer.create({
      name: masterDepartment.name,
      hod: masterDepartment.hod._id,
      batch: batch,
      ability,
    });

    const { semesters: masterSemesters } =
      await masterSemesterDataLayer.findAll({
        departmentId: masterDepartment._id,
      });

    for (const masterSemester of masterSemesters) {
      await semesterService.createSemesterFromMasterSemester({
        masterSemesterId: masterSemester._id,
        departmentId: department._id,
      });
    }

    return { department };
  }

  async findAll({ batch, hod, ability }) {
    const { departments } = await departmentDataLayer.findAll({
      batch,
      hod,
      ability,
    });

    return { departments };
  }

  async findById(departmentId) {
    const { department } = await departmentDataLayer.findById(departmentId);

    if (!department) {
      throw new AppError({ message: 'Department not found!' }, 404);
    }

    return { department };
  }

  async updateById(departmentId, { hod, name }) {
    const { department } = await departmentDataLayer.updateById(departmentId, {
      hod,
      name,
    });

    if (!department) {
      throw new AppError({ message: 'Department not found!' }, 404);
    }

    return { department };
  }

  async deleteById(departmentId) {
    const { department } = await departmentDataLayer.deleteById(departmentId);

    return { department };
  }
}

module.exports = new DepartmentService();
