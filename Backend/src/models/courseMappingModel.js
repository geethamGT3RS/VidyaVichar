import mongoose from 'mongoose';

const CourseMappingSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    courseDesc: {
        type: String,
        default: 'No description provided'
    },
    instructorEmail: {
        type: [String], // Array of strings for instructors
        default: [] 
    },
    taEmail: {
        type: [String], // Array of strings for TAs
        default: [] 
    },
    studentEmail: {
        type: [String], // Array of strings for students
        default: []
    },
});

export default CourseMappingSchema