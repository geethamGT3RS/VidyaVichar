import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true,
    },
    askedByEmail: {
        type: String, // Unique identifier for the student who asked
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    instructorEmail: {
        type: String, // Unique identifier for the instructor assigned
        required: true,
    },
    questionAnswered: {
        type: Boolean,
        default: false,
    },
    isLive: {
        type: Boolean,
        default: false,
    },
    askedAt: {
        type: Date,
        default: Date.now,
    },
    answeredAt: {
        type: Date,
    }
    
});

export default QuestionSchema;