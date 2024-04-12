const {
  subjectGroupDataLayer,
  marksBySubjectDataLayer,
  studentDataLayer,
  subjectDataLayer,
  semesterDataLayer,
  resultDataLayer,
} = require('../data');
const { masterSubjectDataLayer } = require('../data/master-list');
const masterSubjectGroupData = require('../data/master-list/master-subject-group.data');
const { ExamNamesEnum } = require('../enums');
const { AppError } = require('../utils');
const emailService = require('./email.service');
const resultService = require('./result/result.service');
const subjectService = require('./subject.service');
const RevaluationReminderEmail = require('../emails/revalution-reminder-email');

class SubjectGroupService {
  async create(data) {
    const { name, semesterId, isATKTSubjectGroup } = data;

    const { subjectGroup } = await subjectGroupDataLayer.create({
      name,
      isATKTSubjectGroup,
      semesterId,
    });

    return { subjectGroup };
  }

  async createSubjectGroupFromMasterSubject({
    masterSubjectGroupId,
    semesterId,
  }) {
    const { subjectGroup: masterSubjectGroup } =
      await masterSubjectGroupData.findById(masterSubjectGroupId);

    const { subjectGroup } = await subjectGroupDataLayer.create({
      name: masterSubjectGroup.name,
      semesterId,
      isATKTSubjectGroup: masterSubjectGroup.isATKTSubjectGroup,
    });

    const { subjects: masterSubjects } = await masterSubjectDataLayer.findAll({
      subjectGroupId: masterSubjectGroup._id,
    });

    for (const masterSubject of masterSubjects) {
      await subjectService.createSubjectFromMasterSubject({
        masterSubjectId: masterSubject._id,
        subjectGroupId: subjectGroup._id,
      });
    }

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
      if (!marksBySubject) continue;
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

  async generateATKTResultBy(subjectGroupId) {
    const { subjectGroup } = await this.findById(subjectGroupId);
    const { semester } = await semesterDataLayer.findById(
      subjectGroup.semester,
    );

    const { students } = await this.enrolledStudentList(subjectGroupId);

    const marksByStudents = [];

    for (const student of students) {
      const marksByStudent = {
        ...student,
        subjects: [],
      };

      const { subjects } = await subjectDataLayer.findAll({
        subjectGroupId: subjectGroupId,
      });

      const { marksBySubjects: atktMarksBySubjects } =
        await marksBySubjectDataLayer.findBy({
          subjectIds: subjects.map((subject) => subject._id),
          studentId: student.studentId,
        });

      const { student: fullStudent } = await studentDataLayer.findById(
        student.studentId,
      );
      const resultBySemester =
        fullStudent.resultBySemesters[`semester${semester.number}`];

      const { result: resultOfStudents } = await resultDataLayer.findById(
        resultBySemester.resultId,
      );

      const resultOfStudent = resultOfStudents.students.find(
        (r) => `${r.student}` === `${student.studentId}`,
      );

      const exemptedSubjects = resultOfStudent.marks.filter((m) =>
        m.exams.find(
          (e) => e.examName === ExamNamesEnum.TOT && e.symbols.includes('E'),
        ),
      );

      const { marksBySubjects: exemptedMarksBySubjects } =
        await marksBySubjectDataLayer.findBy({
          subjectIds: exemptedSubjects.map(
            (exemptedSubject) => exemptedSubject.subject,
          ),
          studentId: student.studentId,
        });

      for (const marksBySubject of [
        ...atktMarksBySubjects,
        ...exemptedMarksBySubjects,
      ]) {
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

  async sendRevaluationReminder({ subjectGroupId }) {
    const { result } = await resultDataLayer.getResultsBy({ subjectGroupId });

    if (!result) {
      throw new AppError({ message: 'Please Generate result first' });
    }

    const failedStudents = result.students.filter((student) => !student.cgpi);

    const failedStudentsWithSubjects = [];

    for (const failedStudent of failedStudents) {
      const failedSubjects = failedStudent.marks.filter((marksBySubject) =>
        marksBySubject.exams.find((exam) => exam.symbols.includes('F')),
      );
      const { subjects } = await subjectDataLayer.findAll({
        subjectIds: failedSubjects.map((subject) => subject.subject),
      });
      failedStudentsWithSubjects.push({
        email: failedStudent.student.email,
        name: failedStudent.student.name,
        subjects: subjects.map((subject) => subject.name).join(', '),
      });
    }

    for (const failedStudentWithSubjects of failedStudentsWithSubjects) {
      emailService.sendEmail({
        to: failedStudentWithSubjects.email,
        subject: `IMPORTANT! Revaluation form submissions.`,
        html: RevaluationReminderEmail({
          lastDate: '20 April',
          name: failedStudentWithSubjects.name,
          subject: failedStudentWithSubjects.subjects,
        }),
      });
    }
  }
}

module.exports = new SubjectGroupService();
