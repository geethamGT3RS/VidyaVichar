import mongoose from 'mongoose';

const CourseMappingSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    instructorEmail: {
        type: [String], // Array of strings for instructors
    },
    taEmail: {
        type: [String], // Array of strings for TAs
    },
    studentEmail: {
        type: [String], // Array of strings for students
    },
});

const coursemappings = mongoose.model("coursemappings", CourseMappingSchema);
export default coursemappings;