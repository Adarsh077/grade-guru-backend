const mongoose = require('mongoose');
const { MasterListDepartmentModel } = require('../../models/master-list');
const { AppError } = require('../../utils');
const caslEnum = require('../../casl/casl.enum');

class MasterDepartmentDataLayer {
  async create(data) {
    const { name, hod, ability, codeForSeatNo } = data;

    if (
      !ability ||
      ability.cannot(caslEnum.actions.create, caslEnum.subjects.departments)
    ) {
      throw new AppError(
        { message: 'You are not authorized to create department!' },
        403,
      );
    }

    const department = await MasterListDepartmentModel.create({
      name,
      hod,
      codeForSeatNo,
    });

    return { department };
  }

  async findAll({ ability }) {
    const filter = {
      isDeleted: false,
    };

    const query = MasterListDepartmentModel.find(filter);

    if (ability) {
      query.accessibleBy(ability);
    }

    const departments = await query.populate('hod', '_id name');

    return { departments };
  }

  async findOne({ name }) {
    const filter = {
      isDeleted: false,
    };

    if (name) {
      filter.name = name;
    }

    const query = MasterListDepartmentModel.findOne(filter);

    const department = await query.populate('hod', '_id name');

    return { department };
  }

  async findById(departmentId) {
    const department = await MasterListDepartmentModel.findOne({
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

    const department = await MasterListDepartmentModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(departmentId), isDeleted: false },
      { $set: updateData },
      { new: true },
    );

    return { department };
  }

  async deleteById(departmentId) {
    const department = await MasterListDepartmentModel.findByIdAndUpdate(
      departmentId,
      { isDeleted: true },
      { new: true },
    );

    return { department };
  }
}

module.exports = new MasterDepartmentDataLayer();
