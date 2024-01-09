const {
  marksBySubjectService,
  studentsBySemesterService,
  subjectService,
} = require('../services');
const { catchAsync } = require('../utils');

exports.findOneBySubjectId = catchAsync(async (req, res) => {
  const { subjectId } = req.params;

  let { marksBySubject } = await marksBySubjectService.findOneBy(subjectId);
  marksBySubject = JSON.parse(JSON.stringify(marksBySubject));

  const { subject } = await subjectService.findById(subjectId);

  const { studentsBySemester } = await studentsBySemesterService.findOneBy({
    semesterId: subject.semester,
  });

  marksBySubject.marksOfStudents.forEach((marksOfStudent) => {
    const studentDetails = studentsBySemester.find(
      (student) => `${student._id}` === `${marksOfStudent.student}`,
    );
    if (studentDetails) {
      marksOfStudent.student = studentDetails;
    }
  });

  res.send({
    status: 'success',
    body: { marksBySubject },
  });
});

exports.updateMarksOfStudent = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { marksOfStudent } = req.body;

  const { marksBySubject } = await marksBySubjectService.updateMarksOfStudent(
    subjectId,
    { marksOfStudent },
  );

  res.send({
    status: 'success',
    body: { marksBySubject },
  });
});
