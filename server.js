const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB Atlas cluster
mongoose.connect('mongodb+srv://monterokennethpaul:kenneth27@monteroapi.xvfvana.mongodb.net/WEBPROG', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const programSchema = new mongoose.Schema({
  name: String,
  courses: Object 

});

const Program = mongoose.model('Program', programSchema, 'LABORATORY1');

// Define route to retrieve programs with sorted courses by description
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await Program.find();

    // Sort courses within each program by description
    const sortedPrograms = programs.map(program => {
      const sortedCourses = {};
      for (const year in program.courses) {
        sortedCourses[year] = program.courses[year].sort((a, b) => a.description.localeCompare(b.description));
      }
      return { ...program.toObject(), courses: sortedCourses };
    });

    res.json(sortedPrograms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/// retrieve all BSIS courses
app.get('/api/programs/BSIS', async (req, res) => {
  try {
   
    const programs = await Program.find();

    
    const allBSISCourses = programs.reduce((acc, program) => {
      Object.values(program).forEach(year => {
        if (Array.isArray(year)) {
          year.forEach(course => {
            if (course.tags.includes('BSIS')) {
              acc.push(course);
            }
          });
        }
      });
      return acc;
    }, );

    res.json(allBSISCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// retrieve all BSIT courses
app.get('/api/programs/BSIT', async (req, res) => {
  try {
    
    const programs = await Program.find();


    const allBSITCourses = programs.reduce((acc, program) => {
      Object.values(program).forEach(year => {
        if (Array.isArray(year)) {
          year.forEach(course => {
            if (course.tags.includes('BSIT')) {
              acc.push(course);
            }
          });
        }
      });
      return acc;
    }, );

    res.json(allBSITCourses);
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
