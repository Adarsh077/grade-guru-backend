const {
  semesterDataLayer,
  subjectGroupDataLayer,
  departmentDataLayer,
  subjectDataLayer,
  marksBySubjectDataLayer,
  batchDataLayer,
} = require('../data');
const {
  masterSemesterDataLayer,
  masterSubjectDataLayer,
  masterDepartmentDataLayer,
} = require('../data/master-list');
const { AppError } = require('../utils');
const subjectService = require('./subject.service');
const studentService = require('./student.service');
const { StudentTypeEnum } = require('../enums');

class SemesterService {
  async create(data) {
    const { name, departmentId, number } = data;

    const { semester } = await semesterDataLayer.create({
      name,
      departmentId,
      number,
    });

    return { semester };
  }

  async createSemesterFromMasterSemester(data) {
    const { masterSemesterId, departmentId } = data;

    const { semester: masterSemester } =
      await masterSemesterDataLayer.findById(masterSemesterId);

    const { semester } = await semesterDataLayer.create({
      name: masterSemester.name,
      departmentId: departmentId,
      number: masterSemester.number,
    });

    const { subjects: masterSubjects } = await masterSubjectDataLayer.findAll({
      semesterId: masterSemester._id,
    });

    for (const masterSubject of masterSubjects) {
      await subjectService.createSubjectFromMasterSubject({
        masterSubjectId: masterSubject._id,
        semesterId: semester._id,
      });
    }

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

  async updateById(semesterId, { name, departmentId, number }) {
    const { semester } = await semesterDataLayer.updateById(semesterId, {
      name,
      departmentId,
      number,
    });

    return { semester };
  }

  async deleteById(semesterId) {
    const { semester } = await semesterDataLayer.deleteById(semesterId);

    return { semester };
  }

  async findRegisteredStudents(semesterId) {
    const { semester } = await semesterDataLayer.findById(semesterId);

    const persuingYearBySemester = Math.ceil(semester.number / 2);
    const regularBatchYear = new Date().getFullYear() - persuingYearBySemester;
    const dseBatchYear = regularBatchYear + 1;

    const { department } = await departmentDataLayer.findById(
      semester.department,
    );

    const { department: masterDepartment } =
      await masterDepartmentDataLayer.findOne({
        name: department.name,
      });

    const { students: regularStudents } = await studentService.find({
      admissionYear: regularBatchYear,
      departmentId: masterDepartment._id,
      studentType: StudentTypeEnum.REGULAR,
    });

    const { students: dseStudents } = await studentService.find({
      admissionYear: dseBatchYear,
      departmentId: masterDepartment._id,
      studentType: StudentTypeEnum.DSE,
    });

    const students = [
      ...regularStudents.map((student) => ({ name: student.name })),
      ...dseStudents.map((student) => ({ name: student.name })),
    ];

    return { students };
  }

  async generateSeatNoForStudents(semesterId) {
    const { semester } = await semesterDataLayer.findById(semesterId);
    const { department } = await departmentDataLayer.findById(
      semester.department,
    );
    const { batch } = await batchDataLayer.findOne({
      name: department.batch,
    });

    const { subjectGroups } = await subjectGroupDataLayer.findAll({
      semesterId,
    });

    const studentsBySubjectGroup = {};
    for (const subjectGroup of subjectGroups) {
      const { subjects } = await subjectDataLayer.findAll({
        subjectGroupId: subjectGroup._id,
      });

      for (const subject of subjects) {
        const { marksBySubject } =
          await marksBySubjectDataLayer.getMarksBySubjectId({
            subjectId: subject._id,
          });

        if (!marksBySubject) continue;

        if (!studentsBySubjectGroup[subjectGroup._id]) {
          studentsBySubjectGroup[subjectGroup._id] = [];
        }

        marksBySubject.marks.forEach((marks) => {
          if (
            !studentsBySubjectGroup[subjectGroup._id].find(
              (student) => `${student.studentId}` === `${marks.student._id}`,
            )
          ) {
            studentsBySubjectGroup[subjectGroup._id].push({
              studentId: marks.student._id,
            });
          }
        });
      }
    }

    let studentCount = 1;
    for (const subjectGroup of subjectGroups) {
      const subjectGroupStudents = studentsBySubjectGroup[subjectGroup._id];

      const { subjects } = await subjectDataLayer.findAll({
        subjectGroupId: subjectGroup._id,
      });
      for (const subject of subjects) {
        const { marksBySubject } =
          await marksBySubjectDataLayer.getMarksBySubjectId({
            subjectId: subject._id,
          });

        if (!marksBySubject) continue;

        for (const marks of marksBySubject.marks) {
          const studentIndex = subjectGroupStudents.findIndex(
            (student) => `${student.studentId}` === `${marks.student._id}`,
          );
          if (
            !subjectGroupStudents[studentIndex].iatSeatNo ||
            !subjectGroupStudents[studentIndex].eseSeatNo
          ) {
            const iatSeatNo = `${
              department.codeForSeatNo
            }${`0${semester.number}`.slice(-2)}${`000${studentCount}`.slice(
              -3,
            )}`;

            const isEvenSemester = semester.number % 2 === 0;
            const year = isEvenSemester ? batch.year + 1 : batch.year;

            const eseSeatNo = `CC${`${year}`.slice(-2)}${
              isEvenSemester ? 1 : 2
            }${department.codeForSeatNo}${
              semester.number
            }${`000${studentCount}`.slice(-3)}`;

            subjectGroupStudents[studentIndex].iatSeatNo = iatSeatNo;
            subjectGroupStudents[studentIndex].eseSeatNo = eseSeatNo;
            studentCount += 1;
          }

          await marksBySubjectDataLayer.updateSeatNo({
            subjectId: subject._id,
            studentId: marks.student._id,
            iatSeatNo: subjectGroupStudents[studentIndex].iatSeatNo,
            eseSeatNo: subjectGroupStudents[studentIndex].eseSeatNo,
          });
        }
      }
    }
  }

  async enrolledStudentList(semesterId) {
    const { subjectGroups } = await subjectGroupDataLayer.findAll({
      semesterId,
    });

    const { subjects } = await subjectDataLayer.findAll({
      subjectGroupIds: subjectGroups.map((subjectGroup) => subjectGroup._id),
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
}

module.exports = new SemesterService();
