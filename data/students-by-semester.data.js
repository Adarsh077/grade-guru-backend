const mongoose = require('mongoose');
const { StudentsBySemesterModel } = require('../models');

class StudentsBySemesterDataLayer {
  async findOneAndUpdate({ semesterId }, { students }) {
    const updatePromises = students.map(
      (student) =>
        new Promise((resolve, reject) => {
          if (!student._id) {
            StudentsBySemesterModel.findOneAndUpdate(
              { semester: semesterId },
              {
                $push: { students: student },
              },
              { upsert: true, new: true },
            )
              .then(resolve)
              .catch(reject);
            return;
          }

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

    const { studentsBySemester } = await this.findOneBy({ semesterId });

    return { studentsBySemester };
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
