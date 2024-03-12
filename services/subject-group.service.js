const {
  subjectGroupDataLayer,
  marksBySubjectDataLayer,
  studentDataLayer,
} = require('../data');
const { subjectService } = require('./index');
const { AppError } = require('../utils');
const semesterService = require('./semester.service');

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

    const { subjects } = await subjectService.findAll({
      subjectGroupId: subjectGroup._id,
    });

    for (const subject of subjects) {
      const { marksBySubject } =
        await marksBySubjectDataLayer.createMarksEntryForEnrolledStudents({
          studentIds: subjectGroup.enrolledStudents,
          subjectId: subject._id,
        });

      if (marksBySubject && Array.isArray(marksBySubject.marks)) {
        await subjectService.updateById(subject._id, {
          enrolledStudentCount: marksBySubject.marks.length,
        });
      }
    }

    await semesterService.generateSeatNoForStudents(subjectGroup.semester);

    return { subjectGroup };
  }

  async deleteById(subjectGroupId) {
    const { subjectGroup } =
      await subjectGroupDataLayer.deleteById(subjectGroupId);

    return { subjectGroup };
  }
}

module.exports = new SubjectGroupService();
