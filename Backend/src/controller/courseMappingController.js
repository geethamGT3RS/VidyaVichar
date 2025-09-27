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

/**
 * Updates all live questions to non-live status, scoped to a specific instructor and course.
 * @param {string} instructorEmail - The email of the instructor running the session.
 * @param {string} courseName - The name of the course where the session is running.
 * @returns {Object} - Result object from the updateMany operation.
 */
async function endLiveSession(instructorEmail, courseName) {
    try {
        const result = await Question.updateMany(
            // Filter: Find documents where isLive is true AND match the specific instructor/course
            { 
                isLive: true,
                instructorEmail: instructorEmail,
                courseName: courseName
            },
            // Update: Set isLive to false
            { $set: { isLive: false } }
        );

        // Result typically contains { acknowledged: true, modifiedCount: N, upsertedId: null, matchedCount: M }
        return result;

    } catch (error) {
        console.error("Error ending live session:", error);
        throw new Error(`Could not update live questions. Details: ${error.message}`);
    }
}

/**
 * Marks a specific question as answered using its unique questionId.
 * @param {number} questionId - The unique ID of the question to update.
 * @returns {Object} - Result object from the updateOne operation.
 */
async function markQuestionAsAnswered(questionId) {
    try {
        const result = await Question.updateOne(
            // Filter: Find the document matching the questionId
            { questionId: questionId },
            // Update: Set questionAnswered to true and record the current timestamp
            { 
                $set: { 
                    questionAnswered: true,
                    answeredAt: new Date() // Store the current timestamp
                } 
            }
        );

        // Check if a question was actually found and modified
        if (result.matchedCount === 0) {
            throw new Error(`Question with ID ${questionId} not found.`);
        }
        
        return result;

    } catch (error) {
        console.error(`Error marking question ${questionId} as answered:`, error);
        throw new Error(`Could not mark question as answered. Details: ${error.message}`);
    }
}

/**
 * Creates a new question document in the database and automatically assigns a creation timestamp.
 * * @param {Object} questionData - Object containing question details.
 * @param {string} questionData.question - The text of the question.
 * @param {string} questionData.askedByEmail - The email of the student asking the question.
 * @param {string} questionData.courseName - The name of the course the question is related to.
 * @param {string} questionData.instructorEmail - The email of the instructor for this course.
 * @returns {Object} - The newly created Question document.
 */
async function createNewQuestion(questionData) {
    try {
        // --- Get next questionId ---
        // Find the highest existing questionId and increment it.
        // NOTE: For production, you should use a separate sequence collection or rely on the _id.
        const lastQuestion = await Question.findOne().sort({ questionId: -1 });
        const nextQuestionId = lastQuestion ? lastQuestion.questionId + 1 : 1;
        // ---------------------------

        const newQuestion = await Question.create({
            questionId: nextQuestionId, // Assign the new unique ID
            question: questionData.question,
            askedByEmail: questionData.askedByEmail,
            courseName: questionData.courseName,
            instructorEmail: questionData.instructorEmail,
            
            // Default flags and timestamp
            questionAnswered: false,
            isLive: true, // Typically, a new question starts as live
            askedAt: new Date() // Record the creation timestamp (ISODate format)
            
        });

        // The document returned by Mongoose will now include the MongoDB-generated timestamp.
        return newQuestion;

    } catch (error) {
        console.error("Error creating new question:", error);
        throw new Error(`Could not submit question. Details: ${error.message}`);
    }
}



export default {
    getStudentCourses,
    getTACourses,
    getInstructorCourses,
    createNewQuestion,
    endLiveSession,
    markQuestionAsAnswered
};