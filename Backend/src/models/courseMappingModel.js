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
    taEmail: {
        type: [String], // Array of strings for TAs
    },
    studentName: {
        type: [String], // Array of strings for students
        required: true,
    },
});

const coursemappings = mongoose.model("coursemappings", CourseMappingSchema);
export default coursemappings;