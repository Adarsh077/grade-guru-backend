const mongoose = require('mongoose');
const { departmentDataLayer } = require('../data');

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
    const { department } = await departmentDataLayer.findOne({
      _id: mongoose.Types.ObjectId(departmentId),
      isDeleted: false,
    });

    if (department.isDeleted) {
      return { department: null };
    }

    return { department };
  }

  async updateById(departmentId, { hod, name }) {
    const { department } = await departmentDataLayer.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(departmentId), isDeleted: false },
      {
        hod,
        name,
      },
    );

    return { department };
  }

  async deleteById(departmentId) {
    const { department } = await departmentDataLayer.deleteById(departmentId);

    return { department };
  }
}

module.exports = new DepartmentService();
