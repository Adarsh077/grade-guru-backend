const mongoose = require('mongoose');
const { MarksBySubjectModel } = require('../models');

class MarksBySubjectDataLayer {
  async enterMarksFor(data) {
    const { subjectId, studentId, examName, marksScored } = data;

    let marksBySubject = await MarksBySubjectModel.findOne({
      subject: new mongoose.Types.ObjectId(subjectId),
    });

    if (marksBySubject && marksBySubject.marks && marksBySubject.marks.length) {
      const marksIndex = marksBySubject.marks.findIndex(
        (mark) => `${mark.student}` === `${studentId}`,
      );
      if (marksIndex !== -1) {
        const examMarksIndex = marksBySubject.marks[marksIndex].exams.findIndex(
          (exam) => exam.examName === examName,
        );
        if (examMarksIndex !== -1) {
          marksBySubject.marks[marksIndex].exams[examMarksIndex].marksScored =
            marksScored;
        } else {
          marksBySubject.marks[marksIndex].exams.push({
            examName,
            marksScored,
          });
        }
      } else {
        marksBySubject.marks.push({
          student: studentId,
          exams: [{ examName, marksScored }],
        });
      }

      await marksBySubject.save();
      return { marksBySubject };
    }

    marksBySubject = await MarksBySubjectModel.create({
      subject: new mongoose.Types.ObjectId(subjectId),
      marks: [
        {
          student: new mongoose.Types.ObjectId(studentId),
          exams: [{ examName, marksScored }],
        },
      ],
    });

    return { marksBySubject };
  }

  async getMarksBySubjectId(data) {
    const { subjectId } = data;

    const marksBySubject = await MarksBySubjectModel.findOne({
      subject: mongoose.Types.ObjectId(subjectId),
    });

    return marksBySubject;
  }
}

module.exports = new MarksBySubjectDataLayer();
