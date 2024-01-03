const { studentsBySemesterDataLayer } = require('../data');

class StudentsBySemesterService {
  async findOneBy({ semesterId }) {
    const { studentsBySemester } = await studentsBySemesterDataLayer.findOneBy({
      semesterId,
    });

    return { studentsBySemester };
  }

  async findOneAndUpdate({ semesterId }, { students }) {
    const { studentsBySemester } =
      await studentsBySemesterDataLayer.findOneAndUpdate(
        { semesterId },
        { students },
      );

    return { studentsBySemester };
  }
}

module.exports = new StudentsBySemesterService();
