import mongoose from 'mongoose';

const CourseMappingSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    instructorName: {
        type: [String], // Array of strings for instructors
        required: true,
    },
    taName: {
        type: [String], // Array of strings for TAs
    },
    studentName: {
        type: [String], // Array of strings for students
        required: true,
    },
});

export default CourseMappingSchema