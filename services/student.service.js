const { studentDataLayer } = require('../data');

class StudentService {
  async create(data) {
    const { name, email, studentType, admissionYear, departmentId, gender } =
      data;

    const { student } = await studentDataLayer.create({
      name,
      email,
      studentType,
      admissionYear,
      departmentId,
      gender,
    });

    return { student };
  }

  async delete(studentId) {
    const { student } = await studentDataLayer.delete(studentId);

    return { student };
  }

  async find(data) {
    const { admissionYear, departmentId, studentType } = data;
    const { students } = await studentDataLayer.find({
      admissionYear,
      departmentId,
      studentType,
    });

    return { students };
  }

  async findEligibleStudent(data) {
    console.log(JSON.stringify(data, null, 2));
    const { students } = await studentDataLayer.findEligibleStudent(data);

    return { students };
  }

  async update(studentId, data) {
    const { name, email } = data;

    const { student } = await studentDataLayer.update(studentId, {
      name,
      email,
    });

    return { student };
  }
}

module.exports = new StudentService();
