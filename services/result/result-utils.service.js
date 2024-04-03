const { ExamNamesEnum, SubjectTypeEnum } = require('../../enums');
const {
  minMarksByExamName,
  maxMarksByExamName,
} = require('../../utils/marks.util');

class ResultUtilsService {
  getMarkOTotal(subjects) {
    let marksOTotal = 0;

    for (const subject of subjects) {
      const TOTExams = subject.exams.find(
        (exam) => exam.examName === ExamNamesEnum.TOT,
      );

      if (TOTExams) marksOTotal += TOTExams.marksO;
    }

    return marksOTotal;
  }

  getCreditsTotal(subjects) {
    let creditsTotal = 0;

    for (const subject of subjects) {
      if (subject.credits) creditsTotal += subject.credits;
    }

    return creditsTotal;
  }

  getGPCTotal(subjects) {
    let gpcTotal = 0;

    for (const subject of subjects) {
      if (subject.gpc) gpcTotal += subject.gpc;
    }

    return gpcTotal;
  }

  /**
   * @example
   * roundUpToTwoDecimals(5.608695652) //  5.61
   * roundUpToTwoDecimals(6.363636364) //  6.36
   */
  roundUpToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
  }

  caculateGraceMarks(marksBySubjects) {
    /**
     * * ESE Grace Marks
     * *    1. If ESE marks is 29 then + 3 for each subject.
     * *    2. If ESE marks is 24 then + 8 for single subject if all the other subjects are passed
     * * IA Grace Marks
     * *    1. If 6 then + 2 if all other subjects are passed
     * *    2. If fail in IA but has >= 50% in ESE then Exempted
     */
    // ESE Grace Marks
    const failedSubjects = this.getFailedSubjects(marksBySubjects);

    if (!failedSubjects.length) {
      return marksBySubjects.map((marksBySubject) => ({
        ...marksBySubject,
        exams: marksBySubject.exams.map((exam) => ({
          ...exam,
          graceMarks: 0,
          marksOAfterGrace: exam.marksO,
          symbols: [],
        })),
      }));
    }

    const { marks: IAMarkAfterGrace } =
      this.add2GraceMarksForIAExams(marksBySubjects);
    marksBySubjects = IAMarkAfterGrace;
    const { marks: ESEMarksAfterGrace } =
      this.add3GraceMarksForEligibleSubject(marksBySubjects);
    marksBySubjects = ESEMarksAfterGrace;
    const { marks: ESEMarksAfter8Grace } =
      this.add8GraceMarksForSingleSubject(marksBySubjects);
    marksBySubjects = ESEMarksAfter8Grace;
    const { marks: InternalKtExcemptionCheck } =
      this.addCheckForInternalKTExcemption(marksBySubjects);

    marksBySubjects = InternalKtExcemptionCheck;
    marksBySubjects = marksBySubjects.map((marksBySubject) => ({
      ...marksBySubject,
      exams: marksBySubject.exams.map((exam) => {
        const symbols = exam.symbols || [];
        if (
          this.hasFailedBy(
            exam.examName,
            exam.marksOAfterGrace || exam.marksO,
          ) &&
          !symbols.includes('F') &&
          !symbols.includes('E')
        ) {
          symbols.push('F');
        }

        return {
          ...exam,
          symbols: symbols,
        };
      }),
    }));

    return this.calculateWrittenTotal(marksBySubjects);
  }

  add2GraceMarksForIAExams(marksBySubjects) {
    const failedIASubjects = this.getFailedIASubjects(marksBySubjects);

    if (failedIASubjects.length !== 1) return { marks: marksBySubjects };

    const failedIASubject = failedIASubjects[0];

    const { marksO: eseMarksO } = failedIASubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.ESE,
    );
    if (eseMarksO < minMarksByExamName[ExamNamesEnum.ESE]) {
      return { marks: marksBySubjects };
    }

    const subjectIndex = marksBySubjects.findIndex(
      (marksBySubject) => marksBySubject.subject === failedIASubject.subject,
    );

    if (subjectIndex === -1) {
      return { marks: marksBySubjects };
    }

    marksBySubjects[subjectIndex].exams = marksBySubjects[
      subjectIndex
    ].exams.map((exam) => {
      if (exam.examName === ExamNamesEnum.IA) {
        const graceNeeded = minMarksByExamName[ExamNamesEnum.IA] - exam.marksO;
        if (graceNeeded > 2) return exam;

        return {
          ...exam,
          graceMarks: graceNeeded,
          marksOAfterGrace: exam.marksO + graceNeeded,
          symbols: [...(exam.symbols || []), '#'],
        };
      }

      return exam;
    });

    return { marks: marksBySubjects };
  }

  add3GraceMarksForEligibleSubject(marksBySubjects) {
    const failedESESubjects = this.getFailedESESubjects(marksBySubjects);
    if (failedESESubjects.length > 3) return { marks: marksBySubjects };

    for (const failedESESubject of failedESESubjects) {
      const eseExamIndex = failedESESubject.exams.findIndex(
        (exam) => exam.examName === ExamNamesEnum.ESE,
      );
      if (eseExamIndex !== -1) {
        const graceMarksNeeded =
          minMarksByExamName[ExamNamesEnum.ESE] -
          failedESESubject.exams[eseExamIndex].marksO;

        if (graceMarksNeeded > 3) continue;

        const { marksO: iaMarksO } = failedESESubject.exams.find(
          (exam) => exam.examName === ExamNamesEnum.IA,
        );
        if (iaMarksO < minMarksByExamName[ExamNamesEnum.IA]) {
          continue;
        }

        failedESESubject.exams[eseExamIndex].graceMarks = graceMarksNeeded;
        failedESESubject.exams[eseExamIndex].marksOAfterGrace =
          failedESESubject.exams[eseExamIndex].marksO +
          failedESESubject.exams[eseExamIndex].graceMarks;
        failedESESubject.exams[eseExamIndex].symbols = [
          ...(failedESESubject.exams[eseExamIndex].symbols || []),
          '#',
        ];
      }
      const subjectIndex = marksBySubjects.findIndex(
        (marksBySubject) => marksBySubject.subject === failedESESubject.subject,
      );

      if (subjectIndex !== -1) {
        marksBySubjects[subjectIndex] = failedESESubject;
      }
    }

    return { marks: marksBySubjects };
  }

  add8GraceMarksForSingleSubject(marksBySubjects) {
    const failedESESubjects = this.getFailedESESubjects(marksBySubjects);
    if (!failedESESubjects.length || failedESESubjects.length > 1)
      return { marks: marksBySubjects };

    const failedESESubject = failedESESubjects[0];

    const eseExamIndex = failedESESubject.exams.findIndex(
      (exam) => exam.examName === ExamNamesEnum.ESE,
    );
    if (eseExamIndex === -1) return { marks: marksBySubjects };

    const graceNeeded =
      minMarksByExamName[ExamNamesEnum.ESE] -
      failedESESubject.exams[eseExamIndex].marksO;

    if (graceNeeded <= 8) {
      const { marksO: iaMarksO } = failedESESubject.exams.find(
        (exam) => exam.examName === ExamNamesEnum.IA,
      );
      if (iaMarksO < minMarksByExamName[ExamNamesEnum.IA]) {
        return { marks: marksBySubjects };
      }

      failedESESubject.exams[eseExamIndex].graceMarks = graceNeeded;
      failedESESubject.exams[eseExamIndex].marksOAfterGrace =
        failedESESubject.exams[eseExamIndex].marksO + graceNeeded;
      failedESESubject.exams[eseExamIndex].symbols = [
        ...(failedESESubject.exams[eseExamIndex].symbols || []),
        '#',
      ];
    }
    const subjectIndex = marksBySubjects.findIndex(
      (marksBySubject) => marksBySubject.subject === failedESESubject.subject,
    );

    if (subjectIndex !== -1) {
      marksBySubjects[subjectIndex] = failedESESubject;
    }
    return { marks: marksBySubjects };
  }

  addCheckForInternalKTExcemption(marksBySubjects) {
    const failedIASubjects = this.getFailedIASubjects(marksBySubjects);
    const failedESESubjects = this.getFailedESESubjects(marksBySubjects);

    if (failedESESubjects.length || failedIASubjects.length !== 1) {
      return { marks: marksBySubjects };
    }

    const failedIASubject = failedIASubjects[0];
    const eseExam = failedIASubject.exams.find(
      (exam) => exam.examName === ExamNamesEnum.ESE,
    );

    if (!eseExam || !(eseExam.marksOAfterGrace || eseExam.marksO)) {
      return { marks: marksBySubjects };
    }
    const percantageScored =
      ((eseExam.marksOAfterGrace || eseExam.marksO) /
        maxMarksByExamName[ExamNamesEnum.ESE]) *
      100;

    if (percantageScored >= 40) {
      const iaExamIndex = failedIASubject.exams.findIndex(
        (exam) => exam.examName === ExamNamesEnum.IA,
      );
      failedIASubject.exams[iaExamIndex] = {
        ...failedIASubject.exams[iaExamIndex],
        symbols: [...(failedIASubject.exams[iaExamIndex].symbols || []), 'E'],
      };
    }

    const subjectIndex = marksBySubjects.findIndex(
      (marksBySubject) => marksBySubject.subject === failedIASubject.subject,
    );

    if (subjectIndex !== -1) {
      marksBySubjects[subjectIndex] = failedIASubject;
    }
    return { marks: marksBySubjects };
  }

  getFailedSubjects(marksBySubjects) {
    return marksBySubjects.filter((subject) =>
      subject.exams.find((exam) => {
        const minMarks = minMarksByExamName[exam.examName];
        return exam.marksOAfterGrace || exam.marksO < minMarks;
      }),
    );
  }

  getFailedIASubjects(marksBySubjects) {
    return marksBySubjects.filter(
      (subject) =>
        subject.subjectType === SubjectTypeEnum.WRITTEN &&
        subject.exams.find((exam) => {
          const minMarks = minMarksByExamName[exam.examName];
          return (
            exam.examName === ExamNamesEnum.IA &&
            !(exam.symbols || []).includes('E') &&
            (exam.marksOAfterGrace || exam.marksO) < minMarks
          );
        }),
    );
  }

  getFailedESESubjects(marksBySubjects) {
    return marksBySubjects.filter(
      (subject) =>
        subject.subjectType === SubjectTypeEnum.WRITTEN &&
        subject.exams.find((exam) => {
          const minMarks = minMarksByExamName[exam.examName];
          return (
            exam.examName === ExamNamesEnum.ESE &&
            !(exam.symbols || []).includes('E') &&
            (exam.marksOAfterGrace || exam.marksO) < minMarks
          );
        }),
    );
  }

  calculateWrittenTotal(marksBySubjects) {
    return marksBySubjects.map((marksBySubject) => {
      if (marksBySubject.subjectType === SubjectTypeEnum.LAB)
        return marksBySubject;

      const ESEMarks = marksBySubject.exams.find(
        (exam) => exam.examName === ExamNamesEnum.ESE,
      );

      const IAMarks = marksBySubject.exams.find(
        (exam) => exam.examName === ExamNamesEnum.IA,
      );

      marksBySubject.exams = marksBySubject.exams.map((exam) => {
        if (exam.examName === ExamNamesEnum.TOT) {
          return {
            ...exam,
            graceMarks: ESEMarks.graceMarks || IAMarks.graceMarks || 0,
            marksOAfterGrace:
              (ESEMarks.marksOAfterGrace || ESEMarks.marksO) +
              (IAMarks.marksOAfterGrace || IAMarks.marksO),
            symbols: ESEMarks.graceMarks || IAMarks.graceMarks ? ['#'] : [],
          };
        }
        return exam;
      });

      return marksBySubject;
    });
  }

  hasFailedBy(examName, marksO) {
    return marksO < minMarksByExamName[examName];
  }
}

module.exports = new ResultUtilsService();
