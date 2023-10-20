const { departmentDataLayer } = require('../data');
const { AppError } = require('../utils');

class DepartmentService {
  async create(data) {
    const { name, hod, batch } = data;

    const { department } = await departmentDataLayer.create({
      name,
      hod,
      batch,
    });

    return { department };
  }

  async findAll({ batch }) {
    const { departments } = await departmentDataLayer.findAll({ batch });

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
