import express from 'express';
import adminController from '../controller/adminController.js'; 



const router = express.Router();

/**
 * @route   POST /api/courses/instructor-mapping
 * @desc    Create or update a course with its description and add an instructor.
 * @access  Private (assumed)
 */
router.post("/instructor-mapping", async (req, res) => {
    const { courseName, instructorEmail } = req.body;

    if (!courseName  || !instructorEmail) {
        return res.status(400).json({ message: "Missing required fields: courseName, and instructorEmail." });
    }

    try {
        const result = await adminController.uploadInstructorMapping(courseName, instructorEmail);
        res.status(201).json({ message: "Instructor mapping processed successfully.", data: result });
    } catch (error) {
        res.status(500).json({ message: "Failed to process instructor mapping.", error: error.message });
    }
});

/**
 * @route   POST /api/courses/ta-mapping
 * @desc    Add a TA to a course. Creates the course if it doesn't exist.
 * @access  Private (assumed)
 */
router.post("/ta-mapping", async (req, res) => {
    const { courseName, taEmail } = req.body;

    if (!taEmail) {
        return res.status(400).json({ message: "TA email is a required field." });
    }

    try {
        const result = await adminController.uploadTAMapping(courseName, taEmail);
        res.status(201).json({ message: "TA mapping processed successfully.", data: result });
    } catch (error) {
        res.status(500).json({ message: "Failed to process TA mapping.", error: error.message });
    }
});

/**
 * @route   POST /api/courses/student-mapping
 * @desc    Add a student to a course. Creates the course if it doesn't exist.
 * @access  Private (assumed)
 */
router.post("/student-mapping", async (req, res) => {
    const { courseName, studentEmail } = req.body;

    if (!studentEmail) {
        return res.status(400).json({ message: "Student email is a required field." });
    }
    
    try {
        const result = await adminController.uploadStudentMapping(courseName, studentEmail);
        res.status(201).json({ message: "Student mapping processed successfully.", data: result });
    } catch (error) {
        res.status(500).json({ message: "Failed to process student mapping.", error: error.message });
    }
});




export default router;
