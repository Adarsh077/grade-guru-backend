const {
  SubjectTypeEnum,
  FinalResultEnum,
  ResultBySemesterStatusEnum,
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
      if (marksBySubject.subjectType === SubjectTypeEnum.WRITTEN) {
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
      if (marksBySubject.subjectType === SubjectTypeEnum.WRITTEN) {
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
        if (
          exam.symbols &&
          (exam.symbols.includes('F') ||
            exam.symbols.includes('E') ||
            exam.symbols.includes('#'))
        ) {
          return exam;
        }
        return {
          ...exam,
          symbols: [...(exam.symbols || []), 'E'],
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
    const gpcTotal = ResultUtils.getGPCTotal(marksAfterGrace);

    const sgpi = hasFailed
      ? 0
      : ResultUtils.roundUpToTwoDecimals(gpcTotal / creditsTotal);
    const cgpi = hasFailed ? 0 : 0;

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

    return { result };
  }
}

module.exports = new ResultService();
