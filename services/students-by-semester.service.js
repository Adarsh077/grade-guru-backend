const { studentsBySemesterDataLayer } = require('../data');

class StudentsBySemesterService {
  async findOneBy({ semesterId }) {
    const { studentsBySemester } = await studentsBySemesterDataLayer.findOneBy({
      semesterId,
    });

    return { studentsBySemester };
  }

  async findOneAndUpdate({ semesterId }, { students }) {
    const { success } = await studentsBySemesterDataLayer.findOneAndUpdate(
      { semesterId },
      { students },
    );

    return { success };
  }
}

module.exports = new StudentsBySemesterService();
