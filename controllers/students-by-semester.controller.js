const {
  studentsBySemesterService,
  subjectService,
  marksBySubjectService,
} = require('../services');
const { catchAsync } = require('../utils');

exports.findOneBySemesterId = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const { studentsBySemester } = await studentsBySemesterService.findOneBy({
    semesterId,
  });

  res.send({
    status: 'success',
    body: { studentsBySemester },
  });
});

exports.addStudents = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { students } = req.body;

  const { studentsBySemester } = await studentsBySemesterService.addStudents(
    { semesterId },
    { students },
  );

  subjectService.findAll({ semesterId }).then(({ subjects }) => {
    subjects.forEach(async (subject) => {
      const { marksBySubject } = await marksBySubjectService.addStudents(
        subject._id,
        {
          students: studentsBySemester.map((student) => student._id),
        },
      );
      studentsBySemester.forEach((student) => {
        marksBySubjectService.updateMarksOfStudent(subject._id, {
          marksOfStudent: {
            student: student._id,
            marksOfStudentByExam: marksBySubject.exams.map((exam) => ({
              examName: exam.name,
            })),
          },
        });
      });
    });
  });

  res.send({
    status: 'success',
    body: { studentsBySemester },
  });
});

exports.updateBySemesterId = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const { students } = req.body;

  await studentsBySemesterService.findOneAndUpdate(
    { semesterId },
    { students },
  );

  res.send({
    status: 'success',
  });
});
