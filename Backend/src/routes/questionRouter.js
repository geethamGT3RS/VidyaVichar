// src/routes/questionRouter.js
import express from "express";
import {createNewQuestion, getQuestionsByCourseAndInstructor,
        getTACourseQuestions
} from "../controller/questionController.js";

const router = express.Router();

// Route for instructor to get questions for their course
router.get("/instructor", async (req, res) => {
    const { courseName, instructorEmail } = req.query;
    try {
        const questions = await getQuestionsByCourseAndInstructor(courseName, instructorEmail);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route for TA to get non-live questions
router.get("/ta", async (req, res) => {
    const { courseName, taEmail } = req.query;
    try {
        const questions = await getTACourseQuestions(courseName, taEmail);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//creating questions
router.post("/", async (req, res) => {
    const questionData  = req.body;
    try {
        const newQuestion = await createNewQuestion(questionData);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;