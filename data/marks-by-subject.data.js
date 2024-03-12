const mongoose = require('mongoose');
const { MarksBySubjectModel } = require('../models');

class MarksBySubjectDataLayer {
  async createMarksEntryForEnrolledStudents({ subjectId, studentIds }) {
    let marksBySubject = await MarksBySubjectModel.findOne({
      subject: new mongoose.Types.ObjectId(subjectId),
    });

    if (marksBySubject) {
      for (const studentId of studentIds) {
        const isAlreadEnrolled = marksBySubject.marks.find(
          (marks) => `${marks.student}` === `${studentId}`,
        );

        if (!isAlreadEnrolled) {
          marksBySubject.marks.push({
            student: studentId,
            exams: [],
          });
        }
      }

      marksBySubject.marks = marksBySubject.marks.filter((marks) =>
        studentIds.includes(`${marks.student}`),
      );

      await marksBySubject.save();

      return { marksBySubject };
    }

    marksBySubject = await MarksBySubjectModel.create({
      subject: subjectId,
      marks: studentIds.map((studentId) => ({ student: studentId, exams: [] })),
    });

    return { marksBySubject };
  }

  async removeMarksEntryForStudent({ subjectId, studentId }) {
    const marksBySubject = await MarksBySubjectModel.findOne({
      subject: new mongoose.Types.ObjectId(subjectId),
    });

    if (marksBySubject && Array.isArray(marksBySubject.marks)) {
      const marksOfStudentIndex = marksBySubject.marks.findIndex(
        (marks) => `${marks.student}` === `${studentId}`,
      );

      if (marksOfStudentIndex > -1) {
        marksBySubject.marks.splice(marksOfStudentIndex, 1);
      }

      await marksBySubject.save();
    }

    return { marksBySubject };
  }

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

  async updateSeatNo(data) {
    const { subjectId, studentId, iatSeatNo, eseSeatNo } = data;

    const marksBySubject = await MarksBySubjectModel.findOne({
      subject: new mongoose.Types.ObjectId(subjectId),
    });

    if (!marksBySubject) return { marksBySubject: null };

    const marksIndex = marksBySubject.marks.findIndex(
      (mark) => `${mark.student}` === `${studentId}`,
    );

    if (marksIndex > -1) {
      if (eseSeatNo) {
        marksBySubject.marks[marksIndex].eseSeatNo = eseSeatNo;
      }

      if (iatSeatNo) {
        marksBySubject.marks[marksIndex].iatSeatNo = iatSeatNo;
      }

      await marksBySubject.save();
    }

    return { marksBySubject };
  }

  async getMarksBySubjectId(data) {
    const { subjectId } = data;

    const marksBySubject = await MarksBySubjectModel.findOne({
      subject: new mongoose.Types.ObjectId(subjectId),
    }).populate('marks.student', 'name');

    return { marksBySubject };
  }
}

module.exports = new MarksBySubjectDataLayer();
