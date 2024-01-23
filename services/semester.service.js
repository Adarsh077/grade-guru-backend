/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const {
  semesterDataLayer,
  subjectDataLayer,
  marksBySubjectDataLayer,
  studentsBySemesterDataLayer,
  resultDataLayer,
} = require('../data');
const { ExamNamesEnum } = require('../enums');
const { AppError, marksUtils } = require('../utils');
const marksBySubjectService = require('./marks-by-subject.service');

class SemesterService {
  async create(data) {
    const { name, departmentId } = data;

    const { semester } = await semesterDataLayer.create({
      name,
      departmentId,
    });

    return { semester };
  }

  async findAll({ departmentId, departmentIds }) {
    const { semesters } = await semesterDataLayer.findAll({
      departmentId,
      departmentIds,
    });
    return { semesters };
  }

  async findById(semesterId) {
    const { semester } = await semesterDataLayer.findById(semesterId);

    if (!semester) {
      throw new AppError({ message: 'Semester not found!' }, 404);
    }

    return { semester };
  }

  async updateById(semesterId, { name, departmentId }) {
    const { semester } = await semesterDataLayer.updateById(semesterId, {
      name,
      departmentId,
    });

    return { semester };
  }

  async deleteById(semesterId) {
    const { semester } = await semesterDataLayer.deleteById(semesterId);

    return { semester };
  }

  async generateResult(semesterId) {
    const { subjects } = await subjectDataLayer.findAll({ semesterId });

    for (const subject of subjects) {
      await marksBySubjectService.calculateAndUpdateTotalMarks(subject._id);
    }

    const { marksBySubjects } = await marksBySubjectDataLayer.findAllBy({
      subjectIds: subjects.map((subject) => subject._id),
    });

    const { studentsBySemester } = await studentsBySemesterDataLayer.findOneBy({
      semesterId,
    });

    const students = [];

    for (const student of studentsBySemester) {
      const studentWithMarks = {
        seatNo: 'CC23156051',
        name: student.name,
        sgpi: 6.0,
        result: 'P',
        cgpi: 7.05,
        marks: {
          MarksO: [],
          MarksOTotal: 0,
          Grade: [],
          GradeTotal: '',
          C: [],
          CTotal: '',
          GPC: [],
          GPCTotal: '',
        },
      };

      for (const marksBySubject of marksBySubjects) {
        const subject = subjects.find(
          (sub) => `${sub._id}` === `${marksBySubject.subject}`,
        );
        if (!subject) continue;

        const currentStudentMarks = marksBySubject.marksOfStudents.find(
          (marksOf) => `${marksOf.student}` === `${student._id}`,
        );
        if (!currentStudentMarks) continue;
        studentWithMarks.marks.MarksO.push({
          subjectCode: subject.code,
          exams: currentStudentMarks.marksOfStudentByExam
            .filter((mark) =>
              [
                ExamNamesEnum.ESE,
                ExamNamesEnum.IA,
                ExamNamesEnum.PROR,
                ExamNamesEnum.TOT,
                ExamNamesEnum.TW,
              ].includes(mark.examName),
            )
            .map((mark) => ({
              name: mark.examName,
              marks: mark.marksScored,
            })),
        });

        studentWithMarks.marks.MarksOTotal =
          currentStudentMarks.marksOfStudentByExam
            .filter((mark) => [ExamNamesEnum.TOT].includes(mark.examName))
            .reduce((a, b) => a + b.marksScored, 0);

        studentWithMarks.marks.Grade.push({
          subjectCode: subject.code,
          exams: currentStudentMarks.marksOfStudentByExam
            .filter((mark) =>
              [
                ExamNamesEnum.ESE,
                ExamNamesEnum.IA,
                ExamNamesEnum.PROR,
                ExamNamesEnum.TOT,
                ExamNamesEnum.TW,
              ].includes(mark.examName),
            )
            .map((mark) => ({
              name: mark.examName,
              marks: marksUtils.gradeByMarksAndExam(
                mark.examName,
                mark.marksScored,
              ),
            })),
        });

        studentWithMarks.marks.C.push({
          subjectCode: subject.code,
          exams: currentStudentMarks.marksOfStudentByExam
            .filter((mark) =>
              [
                ExamNamesEnum.ESE,
                ExamNamesEnum.IA,
                ExamNamesEnum.PROR,
                ExamNamesEnum.TOT,
                ExamNamesEnum.TW,
              ].includes(mark.examName),
            )
            .map((mark) => ({
              name: mark.examName,
              marks: mark.examName === ExamNamesEnum.TOT ? 3 : '',
            })),
        });

        studentWithMarks.marks.GPC.push({
          subjectCode: subject.code,
          exams: currentStudentMarks.marksOfStudentByExam
            .filter((mark) =>
              [
                ExamNamesEnum.ESE,
                ExamNamesEnum.IA,
                ExamNamesEnum.PROR,
                ExamNamesEnum.TOT,
                ExamNamesEnum.TW,
              ].includes(mark.examName),
            )
            .map((mark) => ({
              name: mark.examName,
              marks: mark.examName === ExamNamesEnum.TOT ? 3 : '',
            })),
        });
      }

      students.push(studentWithMarks);
    }

    const formattedSubject = subjects.map((subject) => {
      const marksBySubject = marksBySubjects.find(
        (marks) => `${marks.subject}` === `${subject._id}`,
      );
      if (!marksBySubject) return { code: '', name: '', exams: '' };
      let exams = [];
      if (
        marksBySubject.exams.find((exam) => exam.name === ExamNamesEnum.IAT1)
      ) {
        exams = [
          {
            name: ExamNamesEnum.IA,
            maxMarks: 20,
            minMarks: 8,
          },
          {
            name: ExamNamesEnum.ESE,
            maxMarks: 80,
            minMarks: 32,
          },
          {
            name: ExamNamesEnum.TOT,
            maxMarks: 100,
            minMarks: 40,
          },
        ];
      } else {
        exams = [
          {
            name: ExamNamesEnum.PROR,
            maxMarks: 25,
            minMarks: 10,
          },
          {
            name: ExamNamesEnum.TW,
            maxMarks: 25,
            minMarks: 10,
          },
          {
            name: ExamNamesEnum.TOT,
            maxMarks: 50,
            minMarks: 20,
          },
        ];
      }

      return {
        code: subject.code,
        name: subject.name,
        exams: exams,
      };
    });

    await resultDataLayer.updateBy({
      semesterId,
      data: { subjects: formattedSubject, students },
    });
  }
}

module.exports = new SemesterService();
