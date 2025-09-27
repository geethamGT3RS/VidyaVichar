import Question from "../models/questionsModel.js";
import CourseMapping from "../models/courseMappingModel.js";

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
                    questionId: '$_id', 
                    question: 1,
                    // Rename the user's name field for clarity in the frontend
                    questionAskedByName: '$askerDetails.userName', 
                    questionAnswered: 1,
                    isLive: 1,
                    courseName: 1, // Optional: Include courseName for context
                    createdAt: 1
                }
            },
            
            // 5. Sort: (Optional but recommended) Sort by live status or question ID.
            {
                $sort: {
                    createdAt: 1// Then by submission order
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
        //const courseMapping = await CourseMapping.findOne(
           // { courseName: courseName, taEmail: taEmail },
           // { instructorEmail: 1, _id: 0 }
       // );

        // If no mapping found, the TA is not assigned to this course.
        //if (!courseMapping || !courseMapping.instructorEmail || courseMapping.instructorEmail.length === 0) {
            //return [];
        //}

        //const instructorEmails = courseMapping.instructorEmail;
        const instructorEmails = ['sai@example.com', 'john@example.com' ];

        // 2. Query the Questions collection using the derived instructor emails.
        const pipeline = [
            // A. Filter: Match the course, ensure the instructor email is one of the assigned instructors, AND isLive is false.
            {
                $match: {
                    courseName: courseName,
                    //instructorEmail: { $in: instructorEmails },
                    instructorEmail: { $in: ["sai@example.com"] },
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
                    questionId: '$_id',
                    question: 1,
                    questionAskedByName: '$askerDetails.userName', 
                    questionAnswered: 1,
                    isLive: 1,
                    courseName: 1, 
                    createdAt: 1
                }
            },
            
            // E. Sort: Sort by submission order.
            {
                $sort: {
                   createdAt: 1 
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



export { getQuestionsByCourseAndInstructor, getTACourseQuestions };
