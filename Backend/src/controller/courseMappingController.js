import CourseMappingSchema from "../models/courseMappingModel";
import User from "../models/userModel.js";


/**
 * Fetches the course name(s) and instructor name(s) for a given student.
 * @param {string} studentUserName - The username of the student (e.g., "Anshul").
 * @returns {Array<Object>} - An array of objects containing { courseName, instructorName }.
 */
async function getStudentCourses(studentUserEmail) {
    try {
        const pipeline = [
            // 1. Deconstruct the studentEmail array to search for the specific student.
            {
                $unwind: '$studentEmail'
            },

            // 2. Match the documents where the studentEmail equals the user's email.
            {
                $match: {
                    studentEmail: studentUserEmail
                }
            },
            
            // 3. Join the 'users' collection to look up the instructor names.
            // We are looking up the name for every email in the 'instructorEmail' array.
            {
                $lookup: {
                    from: 'users',      // The collection to join
                    localField: 'instructorEmail', // Field from the input documents (CourseMapping)
                    foreignField: 'email', // Field from the documents of the 'from' collection (users)
                    as: 'instructorDetails' // Output array field name
                }
            },

            // 4. Reshape the document to include the desired fields.
            {
                $project: {
                    _id: 0,
                    courseName: 1,
                    // Map the array of instructor detail objects to just their userName (name)
                    instructorNames: { 
                        $map: {
                            input: '$instructorDetails',
                            as: 'detail',
                            in: '$$detail.userName'
                        }
                    },
                }
            }
        ];

        const courses = await CourseMapping.aggregate(pipeline);

        return courses;


    } catch (error) {
        console.error("Error fetching student courses:", error);
        throw new Error('Could not retrieve course information.');
    }
}

/**
 * Fetches the course name(s) for a given instructor, with the instructor's name.
 * * @param {string} instructorUserEmail - The unique email ID of the instructor (e.g., "sai@example.com").
 * @returns {Array<Object>} - An array of objects containing { courseName, instructorNames (which is the user's name) }.
 */
async function getInstructorCourses(instructorUserEmail) {
    try {
        const pipeline = [
            // 1. Match courses taught by this instructor's email.
            {
                $match: {
                    instructorEmail: instructorUserEmail
                }
            },
            
            // 2. Join the 'users' collection to get the display name of this instructor.
            {
                $lookup: {
                    from: 'users',
                    localField: 'instructorEmail',
                    foreignField: 'email',
                    as: 'instructorDetails'
                }
            },
            
            // 3. Reshape and project the required fields.
            {
                $project: {
                    _id: 0,
                    courseName: 1,
                    instructorNames: { 
                        $map: {
                            input: '$instructorDetails',
                            as: 'detail',
                            in: '$$detail.userName'
                        }
                    },
                }
            }
        ];

        const courses = await CourseMapping.aggregate(pipeline);

        return courses;
    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        throw new Error(`Could not retrieve instructor course information. Details: ${error.message}`);
    }
}

/**
 * Fetches the course name(s) for a given TA, with the instructor's name.
 * * @param {string} taUserEmail - The unique email ID of the TA (e.g., "aditya@example.com").
 * @returns {Array<Object>} - An array of objects containing { courseName, instructorNames }.
 */
async function getTACourses(taUserEmail) {
    try {
        const pipeline = [
            // 1. Match courses where the TA's email is listed.
            {
                $match: {
                    taEmail: taUserEmail
                }
            },
            
            // 2. Join the 'users' collection to look up the instructor names.
            {
                $lookup: {
                    from: 'users',
                    localField: 'instructorEmail',
                    foreignField: 'email',
                    as: 'instructorDetails'
                }
            },
            
            // 3. Reshape and project the required fields.
            {
                $project: {
                    _id: 0,
                    courseName: 1,
                    instructorNames: { 
                        $map: {
                            input: '$instructorDetails',
                            as: 'detail',
                            in: '$$detail.userName'
                        }
                    },
                }
            }
        ];
        
        const courses = await CourseMapping.aggregate(pipeline);

        return courses;
    } catch (error) {
        console.error("Error fetching TA courses:", error);
        throw new Error(`Could not retrieve TA course information. Details: ${error.message}`);
    }
}

export default {
    getStudentCourses,
    getTACourses,
    getInstructorCourses
};