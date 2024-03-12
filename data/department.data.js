const { default: mongoose } = require('mongoose');
const { DepartmentModel } = require('../models');
const { AppError } = require('../utils');
const caslEnum = require('../casl/casl.enum');

class DepartmentDataLayer {
  async create(data) {
    const { name, hod, batch, ability, codeForSeatNo } = data;

    if (
      !ability ||
      ability.cannot(caslEnum.actions.create, caslEnum.subjects.departments)
    ) {
      throw new AppError(
        { message: 'You are not authorized to create department!' },
        403,
      );
    }

    const department = await DepartmentModel.create({
      name,
      hod,
      batch,
      codeForSeatNo,
    });

    return { department };
  }

  async findAll({ batch, hod, ability }) {
    const filter = {
      isDeleted: false,
    };

    if (batch) {
      filter.batch = batch;
    }

    if (hod) {
      filter.hod = new mongoose.Types.ObjectId(hod);
    }

    const query = DepartmentModel.find(filter);

    if (ability) {
      query.accessibleBy(ability);
    }

    const departments = await query.populate('hod', '_id name');

    return { departments };
  }

  async findById(departmentId) {
    const department = await DepartmentModel.findOne({
      _id: new mongoose.Types.ObjectId(departmentId),
      isDeleted: false,
    }).populate('hod', '_id name');

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

    const department = await DepartmentModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(departmentId), isDeleted: false },
      {
        $set: updateData,
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
