const mongoose = require('mongoose');
const { ResultModel } = require('../models');

class ResultDataLayer {
  async saveResultOfStudent(data) {
    const { semesterId, subjectGroupId, resultOfStudent } = data;

    let result = await ResultModel.findOne({
      semester: new mongoose.Types.ObjectId(`${semesterId}`),
      subjectGroup: new mongoose.Types.ObjectId(`${subjectGroupId}`),
    });

    if (!result) {
      result = await ResultModel.create({
        semester: new mongoose.Types.ObjectId(`${semesterId}`),
        subjectGroup: new mongoose.Types.ObjectId(`${subjectGroupId}`),
      });
    }

    const studentIndex = result.students.findIndex(
      (student) => `${student.student}` === `${resultOfStudent.student}`,
    );

    if (studentIndex === -1) {
      result.students.push(resultOfStudent);
    } else {
      result.students[studentIndex] = resultOfStudent;
    }

    await result.save();

    return { result };
  }

  async getResultsBy(data) {
    const { subjectGroupId } = data;

    const filter = {};
    if (subjectGroupId) {
      filter.subjectGroup = new mongoose.Types.ObjectId(subjectGroupId);
    }

    const result = await ResultModel.findOne(filter);

    return { result };
  }
}

module.exports = new ResultDataLayer();
