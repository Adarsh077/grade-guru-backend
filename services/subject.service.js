const { subjectDataLayer } = require('../data');
const marksBySubjectService = require('./marks-by-subject.service');
const { AppError } = require('../utils');
const { ExamNamesEnum } = require('../enums');
const studentsBySemesterService = require('./students-by-semester.service');

class SubjectService {
  async create(data) {
    const { name, semesterId, staffId, code, exams } = data;

    const { subject } = await subjectDataLayer.create({
      name,
      semesterId,
      staffId,
      code,
    });

    if (exams === 'ESE') {
      marksBySubjectService.updateExamsBySubjectId(subject._id, {
        exams: [
          {
            name: ExamNamesEnum.IAT1,
            maxMarksRequired: 20,
            minMarksRequired: 8,
          },
          {
            name: ExamNamesEnum.IAT2,
            maxMarksRequired: 20,
            minMarksRequired: 8,
          },
          {
            name: ExamNamesEnum.ESE,
            maxMarksRequired: 80,
            minMarksRequired: 32,
          },
        ],
      });
    } else if (exams === 'PROR') {
      marksBySubjectService.updateExamsBySubjectId(subject._id, {
        exams: [
          {
            name: ExamNamesEnum.PROR,
            maxMarksRequired: 25,
            minMarksRequired: 10,
          },
          {
            name: ExamNamesEnum.TW,
            maxMarksRequired: 25,
            minMarksRequired: 10,
          },
        ],
      });
    }

    const { studentsBySemester } = await studentsBySemesterService.findOneBy({
      semesterId,
    });

    const { marksBySubject } = await marksBySubjectService.addStudents(
      subject._id,
      { students: studentsBySemester.map((student) => student._id) },
    );

    studentsBySemester.forEach((student) => {
      marksBySubjectService.updateMarksOfStudent(subject._id, {
        marksOfStudent: {
          student: student._id,
          marksOfStudentByExam: marksBySubject.exams.map((exam) => ({
            examName: exam.name,
          })),
        },
      });
    });

    return { subject };
  }

  async findAll({ semesterId, staffId, semesterIds }) {
    const { subjects } = await subjectDataLayer.findAll({
      semesterId,
      staffId,
      semesterIds,
    });
    return { subjects };
  }

  async findById(subjectId) {
    const { subject } = await subjectDataLayer.findById(subjectId);

    if (!subject) {
      throw new AppError({ message: 'Subject not found!' }, 404);
    }

    return { subject };
  }

  async updateById(subjectId, { name, staffId }) {
    const { subject } = await subjectDataLayer.updateById(subjectId, {
      name,
      staffId,
    });

    return { subject };
  }

  async deleteById(subjectId) {
    const { subject } = await subjectDataLayer.deleteById(subjectId);

    return { subject };
  }
}

module.exports = new SubjectService();
