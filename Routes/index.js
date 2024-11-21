const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Class = require('../Models/Class.js');
const User = require('../Models/User.js');
const Absent = require('../Models/Attendance.js');
const Student = require('../Models/Student.js');
const Attendance = require('../Models/Attendance.js');
const Session = require('../Models/Session.js');

//For the Detailed Attendance

// Get Classes
router.get('/classes', async (req, res) => {
    const classes = await Class.find();
    res.send(classes);
});

//Count classes
router.get('/classes/count', async (req,res) => {
    try {
        const ClassCount = await Class.countDocuments();
        res.status(200).json({ count: ClassCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to count absents' });
    }
        
    });

// Get Students
router.get('/students', async (req, res) => {
    const students = await Student.find();
    res.send(students);
});

// Get Students of the Same Classes
router.get('/students/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        const students = await Student.find({ class_id: classId }).populate('class_id');
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});


// Count Students  by Class
router.get('/students/count/:classId', async (req,res) => {
    try {
        const { classId } = req.params;
        const studentCount = await Student.countDocuments({ class_id: classId });
        res.status(200).json({ count: studentCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to count absents' });
    }
});


// Record Absence
router.post('/absents', async (req, res) => {
    const { classId, studentIds, date, reason } = req.body;

    // Validate input
    if (!classId || !studentIds || studentIds.length === 0) {
        return res.status(400).json({ message: 'Class ID and student IDs are required.' });
    }

    try {
        // Create absence records
        const absents = studentIds.map(studentId => ({
            student_id: studentId,
            class_id: classId,
            date: new Date(), 
            reason: reason || 'Absent'  // Default reason if none provided
        }));

        await Absent.insertMany(absents);
        res.status(201).json({ message: 'Absents recorded successfully!' });
    } catch (error) {
        console.error('Error recording absents:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//Getting Absents for Each session for each class
router.get('/history', async (req,res) =>{
  const sessionId = "67360507f818aaf2a3571a84";
  const classId = "652cd55b2f1b2a8b37c6eaa1";
  
  try {
    const result = await Session.aggregate([
      // 1. Match the session by its ID
      { $match: { _id: new mongoose.Types.ObjectId(sessionId) } }, // Use 'new' here
  
      // 2. Match the class ID
      {
        $match: {
          class_id: new mongoose.Types.ObjectId(classId) // Use 'new' here
        }
      },
  
      // 3. Lookup students in the class
      {
        $lookup: {
          from: 'students',                // The students collection
          localField: 'class_id',          // The class_id in the session collection
          foreignField: 'class_id',        // The class_id in the students collection
          as: 'students_in_class'          // The alias for the joined data
        }
      },
  
      // 4. Project the necessary fields
      {
        $project: {
          totalStudents: { $size: "$students_in_class" },    // Count of students in the class
          attendedStudents: "$attended"                        // Include attended students
        }
      },
  
      // 5. Calculate absent students count
      {
        $set: {
          absentCount: {
            $subtract: [
              { $size: "$students_in_class" },   // Total students in the class
              { $size: "$attendedStudents" }     // Number of students who attended
            ]
          }
        }
      },
  
      // 6. Get the list of absent students
      {
        $set: {
          absentStudents: {
            $filter: {
              input: "$students_in_class", // The array of all students in the class
              as: "student",               // Variable for each student in the class
              cond: { $not: {              // Condition to check if the student is absent
                $in: ["$$student._id", "$attendedStudents"] // If student is NOT in the attended list
              }}
            }
          }
        }
      }
    ]);
  
    console.log(result);
  } catch (error) {
    console.error("Error during aggregation:", error);
  }
  const sessionExists = await Session.findOne({ _id: new mongoose.Types.ObjectId("67360507f818aaf2a3571a84") });
console.log("Session:", sessionExists);

  
});














// Add Student
router.post('/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.send(student);
});
// Add Class
router.post('/classes', async (req, res) => {
    const classObj = new Class(req.body);
    await classObj.save();
    res.send(classObj);
});

module.exports = router;