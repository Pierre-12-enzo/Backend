const express = require('express');
const router = express.Router();
const Class = require('../Models/Class.js');
const User = require('../Models/User.js');
const Absent = require('../Models/Attendance.js');
const Student = require('../Models/Student.js');
const Attendance = require('../Models/Attendance.js');

//For the Detailed Attendance
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

// Get Absents by class
router.get('/absents/:classId', async (req, res) => {
    const { classId } = req.params;
    const absents = await Absent.find({ class_id: classId }).populate('student_id').populate('class_id');
    res.send(absents);
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

// Count Absents by Class
router.get('/absents/count/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        const absentCount = await Absent.countDocuments({ class_id: classId });
        res.status(200).json({ count: absentCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to count absents' });
    }
});

//Total Absents per day
router.get('/absents/count', async (req, res) => {
    try {
        const absentCount = await Absent.countDocuments();
        res.status(200).json({ count: absentCount });
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


module.exports = router;


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


// Get Students
router.get('/students', async (req, res) => {
    const students = await Student.find();
    res.send(students);
});

// Get Classes
router.get('/classes', async (req, res) => {
    const classes = await Class.find();
    res.send(classes);
});


module.exports = router;
