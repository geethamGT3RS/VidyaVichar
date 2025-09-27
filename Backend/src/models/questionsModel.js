import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
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
    answeredAt: {
        type: Date,
    },
 }, { timestamps: true });

const Questions = mongoose.model("questions", QuestionSchema);
export default Questions;