import express from 'express';
import courseController from '../controller/courseMappingController.js'; // Assuming your functions are in this file

const router = express.Router();

/**
 * @route   GET /api/courses/student/:email
 * @desc    Get all courses for a specific student
 * @access  Public (for now; should be protected)
 */
router.get('/student/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const courses = await courseController.getStudentCourses(email);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/courses/instructor/:email
 * @desc    Get all courses for a specific instructor
 * @access  Public
 */
router.get('/instructor/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const courses = await courseController.getInstructorCourses(email);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/courses/ta/:email
 * @desc    Get all courses for a specific TA
 * @access  Public
 */
router.get('/ta/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const courses = await courseController.getTACourses(email);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;