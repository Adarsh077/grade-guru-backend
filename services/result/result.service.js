const {
  SubjectTypeEnum,
  FinalResultEnum,
  ResultBySemesterStatusEnum,
  ExamNamesEnum,
  StudentStatusEnum,
} = require('../../enums');
const WrittenExamResult = require('./written-exam-result.service');
const LabExamResult = require('./lab-exam-result.service');
const ResultUtils = require('./result-utils.service');
const {
  resultDataLayer,
  studentDataLayer,
  semesterDataLayer,
  departmentDataLayer,
  batchDataLayer,
} = require('../../data');

class ResultService {
  async generateResult(semesterId, subjectGroupId, marksByStudent) {
    const marks = [];
    const labMarks = [];
    for (const marksBySubject of marksByStudent.subjects) {
      if (
        [SubjectTypeEnum.WRITTEN, SubjectTypeEnum.WRITTEN_TW].includes(
          marksBySubject.subjectType,
        )
      ) {
        const resultBySubject =
          await WrittenExamResult.generateWrittenExamResult(marksBySubject);
        marks.push(resultBySubject);
      } else if (marksBySubject.subjectType === SubjectTypeEnum.LAB) {
        const resultBySubject =
          LabExamResult.generateLabExamResult(marksBySubject);
        labMarks.push(resultBySubject);
      }
    }

    let marksAfterGrace = ResultUtils.caculateGraceMarks(marks);
    marksAfterGrace.push(...labMarks);
    marksAfterGrace = marksAfterGrace.map((subject) => ({
      ...subject,
      exams: subject.exams.map((exam) => ({
        ...exam,
        symbols: exam.symbols || [],
        marksOAfterGrace: exam.marksOAfterGrace || exam.marksO,
        graceMarks: exam.graceMarks || 0,
      })),
    }));

    marksAfterGrace = marksAfterGrace.map((marksBySubject) => {
      if (
        [SubjectTypeEnum.WRITTEN, SubjectTypeEnum.WRITTEN_TW].includes(
          marksBySubject.subjectType,
        )
      ) {
        return WrittenExamResult.calculateGradeCreditsAndGradePointCredits(
          marksBySubject,
        );
      }

      if (marksBySubject.subjectType === SubjectTypeEnum.LAB) {
        return LabExamResult.calculateGradeCreditsAndGradePointCredits(
          marksBySubject,
        );
      }

      return marksBySubject;
    });

    const isFailedInAtleast1Exam = marksAfterGrace.find((marksBySubject) =>
      marksBySubject.exams.find((exam) => (exam.symbols || []).includes('F')),
    );

    for (const marksBySubject of marksAfterGrace) {
      if (!isFailedInAtleast1Exam) continue;
      marksBySubject.exams = marksBySubject.exams.map((exam) => {
        const failedInOneExam = marksBySubject.exams.find(
          (e) => e.symbols && e.symbols.includes('F'),
        );
        if (
          exam.symbols &&
          (exam.symbols.includes('F') || exam.symbols.includes('E'))
        ) {
          return exam;
        }
        return {
          ...exam,
          symbols: [
            ...(exam.symbols || []),
            exam.examName === ExamNamesEnum.TOT && failedInOneExam ? 'F' : 'E',
          ],
        };
      });
    }

    const hasFailed = !!marksAfterGrace.find((mark) =>
      mark.exams.find((exam) => exam.symbols.includes('F')),
    );

    const hasGraceMarks = !!marksAfterGrace.find((mark) =>
      mark.exams.find((exam) => exam.symbols.includes('#')),
    );

    const marksOTotal = ResultUtils.getMarkOTotal(marksAfterGrace);
    const creditsTotal = ResultUtils.getCreditsTotal(marksAfterGrace);
    let gpcTotal = ResultUtils.getGPCTotal(marksAfterGrace);
    if (marksByStudent.hasParticipatedInNss) {
      gpcTotal += 2.4;
    }

    const sgpi = hasFailed
      ? 0
      : ResultUtils.roundUpToTwoDecimals(gpcTotal / creditsTotal);

    const cgpi = hasFailed
      ? 0
      : await this.calculateCGPIForStudent(marksByStudent.studentId, {
          semesterId,
          gpcTotal,
          creditsTotal,
        });

    const resultOfStudent = {
      student: marksByStudent.studentId,
      seatNo: marksByStudent.eseSeatNo,
      sgpi,
      // eslint-disable-next-line no-nested-ternary
      finalResult: hasFailed
        ? FinalResultEnum.F
        : hasGraceMarks
          ? FinalResultEnum['P#']
          : FinalResultEnum.P,
      cgpi,
      marks: marksAfterGrace,
      marksOTotal,
      creditsTotal,
      gpcTotal,
    };

    const { result } = await this.saveResultOfStudent({
      semesterId,
      subjectGroupId,
      resultOfStudent,
    });

    return { result };
  }

  async calculateCGPIForStudent(studentId, data) {
    let { gpcTotal = 0, creditsTotal = 0 } = data;
    const { semesterId } = data;
    const { student } = await studentDataLayer.findById(studentId);

    const { semester } = await semesterDataLayer.findById(semesterId);

    for (const resultSemester in student.resultBySemesters) {
      if (resultSemester === `semester${semester.number}`) continue;

      if (!student.resultBySemesters[resultSemester]) continue;

      const { resultId } = student.resultBySemesters[resultSemester];

      const { result } = await resultDataLayer.findById(resultId);

      if (!result) continue;

      const studentInResult = result.students.find(
        (s) => `${s.student}` === `${studentId}`,
      );

      if (!studentInResult) continue;

      if (
        typeof studentInResult.gpcTotal === 'number' &&
        !Number.isNaN(studentInResult.gpcTotal)
      ) {
        gpcTotal += studentInResult.gpcTotal;
      }
      if (
        typeof studentInResult.creditsTotal === 'number' &&
        !Number.isNaN(studentInResult.creditsTotal)
      ) {
        creditsTotal += studentInResult.creditsTotal;
      }
    }

    return ResultUtils.roundUpToTwoDecimals(gpcTotal / creditsTotal);
  }

  async getResultsBy({ subjectGroupId }) {
    const { result } = await resultDataLayer.getResultsBy({
      subjectGroupId,
    });

    return { result };
  }

  async saveResultOfStudent({ semesterId, subjectGroupId, resultOfStudent }) {
    const { result } = await resultDataLayer.saveResultOfStudent({
      semesterId,
      subjectGroupId,
      resultOfStudent,
    });

    const { semester } = await semesterDataLayer.findById(semesterId);
    const { department } = await departmentDataLayer.findById(
      semester.department,
    );
    const { batch } = await batchDataLayer.findOne({
      name: department.batch,
    });

    await studentDataLayer.saveResultBySemester({
      semesterNumber: semester.number,
      resultId: result._id,
      status:
        resultOfStudent.finalResult === FinalResultEnum.F
          ? ResultBySemesterStatusEnum.ATKT
          : ResultBySemesterStatusEnum.PASS,
      batchId: batch._id,
      studentId: resultOfStudent.student,
    });

    const hasDrop = await this.checkIfHasDrop(resultOfStudent.student);

    if (hasDrop) {
      await studentDataLayer.update(resultOfStudent.student, {
        status: StudentStatusEnum.DROP,
      });
    } else {
      await studentDataLayer.update(resultOfStudent.student, {
        status:
          resultOfStudent.finalResult === FinalResultEnum.F
            ? ResultBySemesterStatusEnum.ATKT
            : ResultBySemesterStatusEnum.PASS,
      });
    }

    return { result };
  }

  async checkIfHasDrop(studentId) {
    const { student } = await studentDataLayer.findById(studentId);

    const resultIds = Object.keys(student.resultBySemesters)
      .filter((resultSemester) => student.resultBySemesters[resultSemester])
      .map(
        (resultSemester) => student.resultBySemesters[resultSemester].resultId,
      );

    let atktCount = 0;
    for (const resultId of resultIds) {
      if (atktCount > 4) {
        return true;
      }

      const { result } = await resultDataLayer.findById(resultId);

      const studentResult = result.students.find(
        (s) => `${s.student}` === `${studentId}`,
      );

      if (!studentResult) continue;

      const failedSubects = studentResult.marks.filter((mark) =>
        mark.exams.find((exam) => exam.symbols.includes('F')),
      );

      if (failedSubects && failedSubects.length) {
        atktCount += failedSubects.length;
      }
    }

    return atktCount > 4;
  }
}

module.exports = new ResultService();
