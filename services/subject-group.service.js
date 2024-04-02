const {
  subjectGroupDataLayer,
  marksBySubjectDataLayer,
  studentDataLayer,
  subjectDataLayer,
} = require('../data');
const { AppError } = require('../utils');
const semesterService = require('./semester.service');
const resultService = require('./result/result.service');

class SubjectGroupService {
  async create(data) {
    const { name, semesterId } = data;

    const { subjectGroup } = await subjectGroupDataLayer.create({
      name,
      semesterId,
    });

    return { subjectGroup };
  }

  async findAll({ semesterId, semesterIds }) {
    const { subjectGroups } = await subjectGroupDataLayer.findAll({
      semesterId,
      semesterIds,
    });
    return { subjectGroups };
  }

  async findById(subjectGroupId) {
    const { subjectGroup } =
      await subjectGroupDataLayer.findById(subjectGroupId);

    if (!subjectGroup) {
      throw new AppError({ message: 'Subject Group not found!' }, 404);
    }

    return { subjectGroup };
  }

  async updateById(subjectGroupId, { name }) {
    const { subjectGroup } = await subjectGroupDataLayer.updateById(
      subjectGroupId,
      { name },
    );

    return { subjectGroup };
  }

  async enrollStudents(subjectGroupId, { enrolledStudents }) {
    const { students } = await studentDataLayer.find({
      names: enrolledStudents,
    });

    const { subjectGroup } = await subjectGroupDataLayer.updateById(
      subjectGroupId,
      { enrolledStudents: students.map((student) => student._id) },
    );

    if (!subjectGroup) {
      throw new AppError({ message: 'Subject Group not found!' }, 404);
    }

    const { subjects } = await subjectDataLayer.findAll({
      subjectGroupId: subjectGroup._id,
    });

    for (const subject of subjects) {
      const { marksBySubject } =
        await marksBySubjectDataLayer.createMarksEntryForEnrolledStudents({
          studentIds: subjectGroup.enrolledStudents,
          subjectId: subject._id,
        });

      if (marksBySubject && Array.isArray(marksBySubject.marks)) {
        await subjectDataLayer.updateById(subject._id, {
          enrolledStudentCount: marksBySubject.marks.length,
        });
      }
    }

    return { subjectGroup };
  }

  async deleteById(subjectGroupId) {
    const { subjectGroup } =
      await subjectGroupDataLayer.deleteById(subjectGroupId);

    return { subjectGroup };
  }

  async enrolledStudentList(subjectGroupId) {
    const { subjectGroup } =
      await subjectGroupDataLayer.findById(subjectGroupId);

    const { subjects } = await subjectDataLayer.findAll({
      subjectGroupId: subjectGroup._id,
    });

    const students = [];

    for (const subject of subjects) {
      const { marksBySubject } =
        await marksBySubjectDataLayer.getMarksBySubjectId({
          subjectId: subject._id,
        });

      for (const marks of marksBySubject.marks) {
        const isAlreadyPushed = students.find(
          (student) => `${student.studentId}` === `${marks.student._id}`,
        );

        if (!isAlreadyPushed) {
          students.push({
            studentId: marks.student._id,
            name: marks.student.name,
            iatSeatNo: marks.iatSeatNo,
            eseSeatNo: marks.eseSeatNo,
          });
        }
      }
    }

    return { students };
  }

  async generateResultBy(subjectGroupId) {
    const { subjectGroup } = await this.findById(subjectGroupId);

    const { students } = await this.enrolledStudentList(subjectGroupId);

    const { subjects } = await subjectDataLayer.findAll({
      subjectGroupId: subjectGroupId,
    });

    const { marksBySubjects } = await marksBySubjectDataLayer.findBy({
      subjectIds: subjects.map((subject) => subject._id),
    });

    const marksByStudents = [];

    for (const student of students) {
      const marksByStudent = {
        ...student,
        subjects: [],
      };

      for (const marksBySubject of marksBySubjects) {
        const marksOfStudentBySubject = marksBySubject.marks.find(
          (marks) => `${marks.student._id}` === `${student.studentId}`,
        );

        marksByStudent.subjects.push({
          ...JSON.parse(JSON.stringify(marksBySubject.subject)),
          exams: marksOfStudentBySubject.exams,
        });
      }

      marksByStudents.push(marksByStudent);
    }

    for (const marksByStudent of marksByStudents) {
      await resultService.generateResult(
        subjectGroup.semester,
        subjectGroup._id,
        marksByStudent,
      );
    }

    return { marksByStudents };
  }
}

module.exports = new SubjectGroupService();
