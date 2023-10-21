const { semesterDataLayer } = require('../data');
const { AppError } = require('../utils');

class SemesterService {
  async create(data) {
    const { name, departmentId } = data;

    const { semester } = await semesterDataLayer.create({
      name,
      departmentId,
    });

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
