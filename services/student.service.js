const { studentDataLayer } = require('../data');

class StudentService {
  async create(data) {
    const { name, email, studentType, admissionYear, departmentId } = data;

    const { student } = await studentDataLayer.create({
      name,
      email,
      studentType,
      admissionYear,
      departmentId,
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
