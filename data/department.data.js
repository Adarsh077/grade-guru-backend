const { DepartmentModel } = require('../models');

class DepartmentDataLayer {
  async create(data) {
    const { name, hod, batch } = data;

    const department = await DepartmentModel.create({ name, hod, batch });

    return { department };
  }

  async findAll({ batch }) {
    const filter = {
      isDeleted: false,
    };

    if (batch) {
      filter.batch = batch;
    }

    const departments = await DepartmentModel.find(filter).populate(
      'hod',
      '_id name',
    );

    return { departments };
  }

  async findById(departmentId) {
    const department = await DepartmentModel.findById(departmentId).populate(
      'hod',
      '_id name',
    );

    return { department };
  }

  async updateById(departmentId, { name, hod }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (hod) {
      updateData.hod = hod;
    }

    const department = await DepartmentModel.findByIdAndUpdate(
      departmentId,
      {
        $set: { name, hod },
      },
      { new: true },
    );

    return { department };
  }

  async deleteById(departmentId) {
    const department = await DepartmentModel.findByIdAndUpdate(
      departmentId,
      { isDeleted: true },
      { new: true },
    );

    return { department };
  }
}

module.exports = new DepartmentDataLayer();
