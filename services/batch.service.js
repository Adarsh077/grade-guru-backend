/* eslint-disable no-restricted-syntax */
const { batchDataLayer } = require('../data');
const { masterDepartmentDataLayer } = require('../data/master-list');
const departmentService = require('./department.service');

class BatchService {
  async create(data) {
    const { name, year, ability } = data;

    const { batch } = await batchDataLayer.create({
      name,
      year,
    });

    const { departments: masterDepartments } =
      await masterDepartmentDataLayer.findAll({ ability });

    for (const masterDepartment of masterDepartments) {
      await departmentService.createDepartmentFromMaster({
        masterDeparmentId: masterDepartment._id,
        batch: batch.name,
        ability,
      });
    }

    return { batch };
  }

  async findAll() {
    const { batches } = await batchDataLayer.findAll();

    return { batches };
  }

  async findOne({ name }) {
    const { batch } = await batchDataLayer.findOne({ name });

    return { batch };
  }
}

module.exports = new BatchService();
