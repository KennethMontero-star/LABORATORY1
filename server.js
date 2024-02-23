const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB Atlas cluster
mongoose.connect('mongodb+srv://monterokennethpaul:kenneth27@monteroapi.xvfvana.mongodb.net/WEBPROG', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema and model
const programSchema = new mongoose.Schema({
  name: String,
  courses: Object 
});

const Program = mongoose.model('Program', programSchema, 'LABORATORY1');

// Define route to retrieve programs
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/courses/:courseCode', async (req, res) => {
  try {
    const courseCode = req.params.courseCode;
    let foundCourse = null;

    // Retrieve programs from the MongoDB database
    const programs = await Program.find();

    // Iterate through each program to find the course with the specified code
    programs.forEach(program => {
      Object.values(program).forEach(year => {
        year.forEach(course => {
          if (course.code === courseCode) {
            foundCourse = course;
          }
        });
      });
    });

    // If the course is found, return it; otherwise, return a "Course not found" error
    if (foundCourse) {
      res.json(foundCourse);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
