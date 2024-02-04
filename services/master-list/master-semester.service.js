const { masterSemesterDataLayer } = require('../../data/master-list');
const { AppError } = require('../../utils');

class SemesterService {
  async create(data) {
    const { name, number, departmentId } = data;

    const { semester } = await masterSemesterDataLayer.create({
      name,
      number,
      departmentId,
    });

    return { semester };
  }

  async findAll({ departmentId, departmentIds }) {
    const { semesters } = await masterSemesterDataLayer.findAll({
      departmentId,
      departmentIds,
    });
    return { semesters };
  }

  async findById(semesterId) {
    const { semester } = await masterSemesterDataLayer.findById(semesterId);

    if (!semester) {
      throw new AppError({ message: 'Semester not found!' }, 404);
    }

    return { semester };
  }

  async updateById(semesterId, { name, number, departmentId }) {
    const { semester } = await masterSemesterDataLayer.updateById(semesterId, {
      name,
      number,
      departmentId,
    });

    return { semester };
  }

  async deleteById(semesterId) {
    const { semester } = await masterSemesterDataLayer.deleteById(semesterId);

    return { semester };
  }
}

module.exports = new SemesterService();
