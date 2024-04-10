const {
  subjectDataLayer,
  marksBySubjectDataLayer,
  subjectGroupDataLayer,
  semesterDataLayer,
  studentDataLayer,
  resultDataLayer,
} = require('../data');
const { masterSubjectDataLayer } = require('../data/master-list');
const { AppError } = require('../utils');

class SubjectService {
  async create(data) {
    const {
      name,
      subjectGroupId,
      staffId,
      code,
      credits,
      subjectType,
      isATKTSubject,
      gender,
    } = data;

    const { subject } = await subjectDataLayer.create({
      name,
      subjectGroupId,
      staffId,
      code,
      credits,
      subjectType,
      isATKTSubject,
      gender,
    });

    return { subject };
  }

  async createSubjectFromMasterSubject({ masterSubjectId, subjectGroupId }) {
    const { subject: masterSubject } =
      await masterSubjectDataLayer.findById(masterSubjectId);

    const { subject } = await subjectDataLayer.create({
      name: masterSubject.name,
      subjectGroupId,
      staffId: masterSubject.staff,
      code: masterSubject.code,
      subjectType: masterSubject.subjectType,
      credits: masterSubject.credits,
      isATKTSubject: masterSubject.isATKTSubject,
    });

    return { subject };
  }

  async findAll({ subjectGroupId, staffId, subjectGroupIds }) {
    const { subjects } = await subjectDataLayer.findAll({
      subjectGroupId,
      staffId,
      subjectGroupIds,
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

  async enrollStudent(subjectId, { students: studentNames }) {
    const { students } = await studentDataLayer.find({
      names: studentNames,
    });

    const { marksBySubject } =
      await marksBySubjectDataLayer.createMarksEntryForEnrolledStudents({
        studentIds: students.map((student) => student._id),
        subjectId,
      });

    await subjectDataLayer.updateById(subjectId, {
      enrolledStudentCount: marksBySubject.marks.length,
    });

    return { marksBySubject };
  }

  async unEnrollStudent(subjectId, { studentId }) {
    const { marksBySubject } =
      await marksBySubjectDataLayer.removeMarksEntryForStudent({
        studentId,
        subjectId,
      });

    await subjectDataLayer.updateById(subjectId, {
      enrolledStudentCount: marksBySubject.marks.length,
    });

    return { marksBySubject };
  }

  async findATKTStudents(subjectId) {
    const { subject } = await subjectDataLayer.findById(subjectId);

    if (!subject.isATKTSubject) {
      throw new AppError(
        { message: `${subject.name} is not ATKT subject!` },
        400,
      );
    }

    const { subjectGroup } = await subjectGroupDataLayer.findById(
      subject.subjectGroup,
    );

    if (!subjectGroup.isATKTSubjectGroup) {
      throw new AppError(
        { message: `${subjectGroup.name} is not ATKT subject group!` },
        400,
      );
    }

    const { semester } = await semesterDataLayer.findById(
      subjectGroup.semester,
    );

    const { students: studentsWithATKT } =
      await studentDataLayer.findStudentsWithATKT(semester.number);

    const students = [];

    for (const student of studentsWithATKT) {
      const resultBySemester =
        student.resultBySemesters[`semester${semester.number}`];
      if (!resultBySemester || !resultBySemester.resultId) continue;

      const { result } = await resultDataLayer.findById(
        resultBySemester.resultId,
      );

      const resultOfStudent = result.students.find(
        (resultByStudent) => `${resultByStudent.student}` === `${student._id}`,
      );

      if (!resultOfStudent) continue;

      const marksOfSubject = resultOfStudent.marks.find(
        (marks) => `${marks.subjectCode}` === `${subject.code}`,
      );

      const hasFailed = marksOfSubject.exams.find((exam) =>
        exam.symbols.includes('F'),
      );

      if (hasFailed) {
        students.push({
          name: student.name,
        });
      }
    }

    return { students };
  }
}

module.exports = new SubjectService();
