import QuestionSchema from "../models/questionsModel";  
import User from "../models/userModel.js";

/**
 * Fetches questions for a specific course and instructor, populating the asker's name.
 * @param {string} courseName - The name of the course (e.g., "SSD").
 * @param {string} instructorEmail - The email of the instructor for filtering.
 * @returns {Array<Object>} - List of questions with asker's name and status flags.
 */
async function getQuestionsByCourseAndInstructor(courseName, instructorEmail) {
    try {
        const pipeline = [
            // 1. Filter: Find questions matching both the course and the instructor's email.
            {
                $match: {
                    courseName: courseName,
                    instructorEmail: instructorEmail
                }
            },

            // 2. Lookup: Join the 'users' collection to get the asker's name.
            {
                $lookup: {
                    from: 'users',      // The collection to join
                    localField: 'askedByEmail', // Field from the Questions document
                    foreignField: 'email', // Field from the Users document
                    as: 'askerDetails' // Output array field name (will contain one user)
                }
            },

            // 3. Unwind: Since askedByEmail is unique, this simplifies the array to a single object.
            {
                $unwind: '$askerDetails'
            },

            // 4. Project: Select and reshape the final output.
            {
                $project: {
                    _id: 0,
                    questionId: 1,
                    question: 1,
                    // Rename the user's name field for clarity in the frontend
                    questionAskedByName: '$askerDetails.userName', 
                    questionAnswered: 1,
                    isLive: 1,
                    courseName: 1, // Optional: Include courseName for context
                    askedAt: 1
                }
            },
            
            // 5. Sort: (Optional but recommended) Sort by live status or question ID.
            {
                $sort: {
                    isLive: -1, // Live questions first
                    questionId: 1 // Then by submission order
                }
            }
        ];

        const questions = await Question.aggregate(pipeline);

        return questions;

    } catch (error) {
        console.error("Error fetching questions:", error);
        throw new Error(`Could not retrieve question list. Details: ${error.message}`);
    }
}

/**
 * Fetches questions for a specific course assigned to a TA where the question is not live (isLive: false).
 * @param {string} courseName - The name of the course (e.g., "SSD").
 * @param {string} taEmail - The email of the TA.
 * @returns {Array<Object>} - List of non-live questions with asker's name and status flags.
 */
async function getTACourseQuestions(courseName, taEmail) {
    try {
        // 1. Find the Instructor Email(s) associated with this course and TA from courseMapping
        const courseMapping = await CourseMapping.findOne(
            { courseName: courseName, taEmail: taEmail },
            { instructorEmail: 1, _id: 0 }
        );

        // If no mapping found, the TA is not assigned to this course.
        if (!courseMapping || !courseMapping.instructorEmail || courseMapping.instructorEmail.length === 0) {
            return [];
        }

        const instructorEmails = courseMapping.instructorEmail;

        // 2. Query the Questions collection using the derived instructor emails.
        const pipeline = [
            // A. Filter: Match the course, ensure the instructor email is one of the assigned instructors, AND isLive is false.
            {
                $match: {
                    courseName: courseName,
                    instructorEmail: { $in: instructorEmails },
                    isLive: false // The required filter for TA-viewable questions
                }
            },

            // B. Lookup: Join the 'users' collection to get the asker's name.
            {
                $lookup: {
                    from: 'users',      
                    localField: 'askedByEmail', 
                    foreignField: 'email', 
                    as: 'askerDetails' 
                }
            },

            // C. Unwind: Simplify the array to a single object.
            {
                $unwind: '$askerDetails'
            },

            // D. Project: Select and reshape the final output.
            {
                $project: {
                    _id: 0,
                    questionId: 1,
                    question: 1,
                    questionAskedByName: '$askerDetails.userName', 
                    questionAnswered: 1,
                    isLive: 1,
                    courseName: 1, 
                    askedAt: 1
                }
            },
            
            // E. Sort: Sort by submission order.
            {
                $sort: {
                    questionId: 1 
                }
            }
        ];

        const questions = await Question.aggregate(pipeline);

        return questions;

    } catch (error) {
        console.error("Error fetching TA questions:", error);
        throw new Error(`Could not retrieve TA question list. Details: ${error.message}`);
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


module.exports = {
    getQuestionsByCourseAndInstructor,
    getTACourseQuestions,
    endLiveSession,
    markQuestionAsAnswered,
    createNewQuestion
};