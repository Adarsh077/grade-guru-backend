const mongoose = require('mongoose');
const { StudentsBySemesterModel } = require('../models');

class StudentsBySemesterDataLayer {
  async addStudents({ semesterId }, { students }) {
    const studentsBySemester = await StudentsBySemesterModel.findOneAndUpdate(
      { semester: semesterId },
      {
        $push: { students: { $each: students } },
      },
      { upsert: true, new: true },
    );

    return { studentsBySemester: studentsBySemester.students };
  }

  async findOneAndUpdate({ semesterId }, { students }) {
    const updatePromises = students.map(
      (student) =>
        new Promise((resolve, reject) => {
          this.findOneBy({ semesterId })
            .then(({ studentsBySemester: studentsBySemesterCurrent }) => {
              const studentIndex = studentsBySemesterCurrent.findIndex(
                (studentRecord) => `${studentRecord._id}` === `${student._id}`,
              );

              if (studentIndex === -1) {
                resolve();
                return;
              }

              return StudentsBySemesterModel.findOneAndUpdate(
                { semester: semesterId },
                { $set: { [`students.${studentIndex}`]: student } },
                { new: true },
              );
            })
            .then(resolve)
            .catch(reject);
        }),
    );

    await Promise.all(updatePromises);

    return { success: true };
  }

  async findOneBy({ semesterId }) {
    const filter = {};

    if (semesterId) {
      filter.semester = new mongoose.Types.ObjectId(semesterId);
    }

    const studentsBySemester = await StudentsBySemesterModel.findOne(filter);

    if (!studentsBySemester) {
      return { studentsBySemester: [] };
    }

    return { studentsBySemester: studentsBySemester.students };
  }
}

module.exports = new StudentsBySemesterDataLayer();
