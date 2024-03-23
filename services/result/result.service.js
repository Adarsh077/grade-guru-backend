const { SubjectTypeEnum } = require('../../enums');
const WrittenExamResult = require('./written-exam-result.service');
const LabExamResult = require('./lab-exam-result.service');
const ResultUtils = require('./result-utils.service');
const { resultDataLayer } = require('../../data');

class ResultService {
  async generateResult(semesterId, subjectGroupId, marksByStudent) {
    const marks = [];

    for (const marksBySubject of marksByStudent.subjects) {
      if (marksBySubject.subjectType === SubjectTypeEnum.WRITTEN) {
        const resultBySubject =
          await WrittenExamResult.generateWrittenExamResult(marksBySubject);
        marks.push(resultBySubject);
      } else if (marksBySubject.subjectType === SubjectTypeEnum.LAB) {
        LabExamResult.calculateLabSubjectTotal(marksBySubject);
      }
    }

    const hasFailed = !!marks.find((mark) =>
      mark.exams.find((exam) => exam.grade === 'F'),
    );

    const marksOTotal = ResultUtils.getMarkOTotal(marks);
    const creditsTotal = ResultUtils.getCreditsTotal(marks);
    const gpcTotal = ResultUtils.getGPCTotal(marks);

    const sgpi = hasFailed
      ? 0
      : ResultUtils.roundUpToTwoDecimals(gpcTotal / creditsTotal);
    const cgpi = hasFailed ? 0 : 0;

    const resultOfStudent = {
      student: marksByStudent.studentId,
      seatNo: marksByStudent.eseSeatNo,
      sgpi,
      finalResult: hasFailed ? 'F' : 'P',
      cgpi,
      marks,
      marksOTotal,
      creditsTotal,
      gpcTotal,
    };

    const { result } = await resultDataLayer.saveResultOfStudent({
      semesterId,
      subjectGroupId,
      resultOfStudent,
    });

    return { result };
  }
}

module.exports = new ResultService();
