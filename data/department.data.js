const { DepartmentModel } = require('../models');

class DepartmentDataLayer {
  async create(data) {
    const { name, hod } = data;

    const department = await DepartmentModel.create({ name, hod });

    return { department };
  }

  async findAll() {
    const departments = await DepartmentModel.find({
      isDeleted: false,
    }).populate('hod', '_id name');

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
