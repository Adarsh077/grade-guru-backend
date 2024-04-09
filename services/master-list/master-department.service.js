const { AppError } = require('../../utils');
const { masterDepartmentDataLayer } = require('../../data/master-list');

class MasterDepartmentService {
  async create(data) {
    const { name, hod, ability, codeForSeatNo } = data;

    const { department } = await masterDepartmentDataLayer.create({
      name,
      hod,
      ability,
      codeForSeatNo,
    });

    return { department };
  }

  async findAll({ hod, ability }) {
    const { departments } = await masterDepartmentDataLayer.findAll({
      hod,
      ability,
    });

    return { departments };
  }

  async findById(departmentId) {
    const { department } =
      await masterDepartmentDataLayer.findById(departmentId);

    if (!department) {
      throw new AppError({ message: 'Department not found!' }, 404);
    }

    return { department };
  }

  async updateById(departmentId, { hod, name }) {
    const { department } = await masterDepartmentDataLayer.updateById(
      departmentId,
      {
        hod,
        name,
      },
    );

    if (!department) {
      throw new AppError({ message: 'Department not found!' }, 404);
    }

    return { department };
  }

  async deleteById(departmentId) {
    const { department } =
      await masterDepartmentDataLayer.deleteById(departmentId);

    return { department };
  }
}

module.exports = new MasterDepartmentService();
