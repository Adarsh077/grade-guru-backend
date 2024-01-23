const mongoose = require('mongoose');
const { MarksBySubjectModel } = require('../models');

class MarksBySubjectDataLayer {
  async findOneBy(subjectId) {
    const marksBySubject = await MarksBySubjectModel.findOne({
      subject: subjectId,
    });

    return { marksBySubject };
  }

  async findAllBy({ subjectIds }) {
    subjectIds = subjectIds.map(
      (subjectId) => new mongoose.Types.ObjectId(`${subjectId}`),
    );

    const marksBySubjects = await MarksBySubjectModel.find({
      subject: { $in: subjectIds },
    });

    return {
      marksBySubjects: marksBySubjects.map((marksBySubject) =>
        marksBySubject.toJSON(),
      ),
    };
  }

  async updateExamsBySubjectId(subjectId, { exams }) {
    const marksBySubject = await MarksBySubjectModel.findOneAndUpdate(
      { subject: subjectId },
      { $set: { exams } },
      { upsert: true, new: true },
    );

    return { marksBySubject };
  }

  async addStudents(subjectId, { students }) {
    students = students.map((student) => ({ student: student }));

    const marksBySubject = await MarksBySubjectModel.findOneAndUpdate(
      { subject: subjectId },
      { $push: { marksOfStudents: { $each: students } } },
      { new: true },
    );

    return { marksBySubject };
  }

  async updateMarksOfStudent(subjectId, { marksOfStudent }) {
    let marksBySubject = await MarksBySubjectModel.findOne({
      subject: subjectId,
    });

    if (!marksBySubject) return { marksBySubject: null };

    const marksOfStudentIndex = marksBySubject.marksOfStudents.findIndex(
      (studentsMarksRecord) =>
        `${studentsMarksRecord.student}` === `${marksOfStudent.student}`,
    );

    marksBySubject = await MarksBySubjectModel.findOneAndUpdate(
      { subject: subjectId },
      { $set: { [`marksOfStudents.${marksOfStudentIndex}`]: marksOfStudent } },
      { new: true },
    );

    return { marksBySubject };
  }
}

module.exports = new MarksBySubjectDataLayer();
