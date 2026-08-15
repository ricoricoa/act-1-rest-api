const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let students = [];
let nextStudentId = 1;

const requiredStudentFields = [
  'firstname',
  'lastname',
  'program',
  'year',
  'age',
  'gender'
];

const allowedStudentFields = new Set([
  'id',
  'firstname',
  'lastname',
  'program',
  'year',
  'age',
  'gender',
  'email',
  'phone',
  'address'
]);

app.get('/', (req, res) => {
  res.send('<h1>ACTIVITY 1 - REST API</h1>');
});

app.get('/students', (req, res) => {
  const filters = { ...req.query };

  if (Object.keys(filters).length === 0) {
    return res.json({
      success: true,
      data: students,
      count: students.length,
      message: 'Empty Data'
    });
  }

  const filteredStudents = students.filter((student) => {
    return Object.keys(filters).every((key) => {
      if (!(key in student)) return false;
      return String(student[key]).toLowerCase() === String(filters[key]).toLowerCase();
    });
  });

  if (filteredStudents.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No student found',
      filters: filters
    });
  }

  return res.json({
    success: true,
    data: filteredStudents,
    count: filteredStudents.length,
    filters: filters
  });
});

app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find((entry) => entry.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found',
      id: id
    });
  }

  return res.json({
    success: true,
    data: student
  });
});

app.get('/students/field/:fieldName', (req, res) => {
  const fieldName = req.params.fieldName;

  if (!allowedStudentFields.has(fieldName)) {
    return res.status(404).json({
      success: false,
      error: `Field '${fieldName}' is not part of the Student Profile schema`,
      fieldName: fieldName
    });
  }

  const values = students.map((student) => student[fieldName]);
  const validValues = values.filter((value) => value !== undefined);

  if (validValues.length === 0) {
    return res.status(404).json({
      success: false,
      error: `No student data found for '${fieldName}'`,
      fieldName: fieldName
    });
  }

  return res.json({
    success: true,
    fieldName: fieldName,
    data: values,
    count: validValues.length,
    message: `Extracted '${fieldName}' from all student profiles`
  });
});

app.post('/students', (req, res) => {
  const studentData = { ...req.body };

  if (!studentData || Object.keys(studentData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Student data is required'
    });
  }

  const missingFields = requiredStudentFields.filter((field) => {
    const value = studentData[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing required student fields',
      missing: missingFields
    });
  }

  Object.keys(studentData).forEach((key) => {
    if (!allowedStudentFields.has(key)) {
      delete studentData[key];
    }
  });

  const newStudent = {
    id: nextStudentId++,
    firstname: studentData.firstname,
    lastname: studentData.lastname,
    program: studentData.program,
    year: studentData.year,
    age: Number(studentData.age),
    gender: studentData.gender,
    email: studentData.email || '',
    phone: studentData.phone || '',
    address: studentData.address || ''
  };

  students.push(newStudent);

  return res.status(201).json({
    success: true,
    message: 'Student profile created successfully',
    data: newStudent
  });
});

app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find((entry) => entry.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found',
      id: id
    });
  }

  const updates = { ...req.body };
  Object.keys(updates).forEach((key) => {
    if (allowedStudentFields.has(key) && key !== 'id') {
      student[key] = updates[key];
    }
  });

  return res.json({
    success: true,
    message: 'Student profile updated successfully',
    data: student
  });
});

app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = students.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Student not found',
      id: id
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  return res.json({
    success: true,
    message: 'Student profile deleted successfully',
    data: deletedStudent
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Student Profile API listening on http://localhost:${port}`);
  console.log(`Open http://localhost:${port} to view the activity title`);
});
