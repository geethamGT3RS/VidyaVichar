import CourseMapping from "../models/courseMappingModel.js";

async function uploadInstructorMapping(courseName, instructorEmail) {
    try {
        // Use findOneAndUpdate with upsert: true
        const result = await CourseMapping.findOneAndUpdate(
            { courseName: courseName },
            {
                // $addToSet ensures the email is only added if it's NOT already in the array
                $addToSet: { instructorEmail: instructorEmail }
            },
            {
                new: true, // Return the modified document rather than the original
                upsert: true, // IMPORTANT: Create the document if it doesn't exist
                runValidators: true, // Run Mongoose schema validators
            }
        );
        
        return { 
            courseName: result.courseName, 
            status: result ? 'Updated/Created' : 'Failed' 
        };

    } catch (error) {
        console.error(`Error processing course mapping for ${courseName}:`, error);
        throw new Error(`Failed to upload instructor mapping: ${error.message}`);
    }
}
/**
 * @param {string} courseName - The name of the course (unique identifier).
 * @param {string} taEmail - The email of the TA to add.
 * @returns {Object} - The result of the upsert operation.
 */
async function uploadTAMapping(courseName, taEmail) {
    try {
        // Use findOneAndUpdate with upsert: true
        const result = await CourseMapping.findOneAndUpdate(
            // 1. QUERY: Find a document where the courseName matches
            { courseName: courseName },

            {
                // $addToSet ensures the email is only added if it's NOT already in the array
                $addToSet: { taEmail: taEmail }
            },

            // 3. OPTIONS: 
            {
                new: true, 
                upsert: true, 
                runValidators: true, 
            }
        );
        
        return { 
            courseName: result.courseName, 
            status: result ? 'Updated/Created' : 'Failed' 
        };

    } catch (error) {
        console.error(`Error processing TA mapping for ${courseName}:`, error);
        throw new Error(`Failed to upload TA mapping: ${error.message}`);
    }
}

/**
 * Handles the upsert logic for a single course-Student mapping row (No course description update).
 * If the course exists, it pushes the student email if not present.
 * If the course does not exist, it creates the new course document.
 * @param {string} courseName - The name of the course (unique identifier).
 * @param {string} studentEmail - The email of the student to add.
 * @returns {Object} - The result of the upsert operation.
 */
async function uploadStudentMapping(courseName, studentEmail) {
    try {
        // Use findOneAndUpdate with upsert: true
        const result = await CourseMapping.findOneAndUpdate(
            // 1. QUERY: Find a document where the courseName matches
            { courseName: courseName },

            // 2. UPDATE: Conditionally push the new student email
            {
                // $addToSet ensures the email is only added if it's NOT already in the array
                $addToSet: { studentEmail: studentEmail }
            },

            // 3. OPTIONS: 
            {
                new: true, // Return the modified document rather than the original
                upsert: true, // IMPORTANT: Create the document if it doesn't exist
                runValidators: true, // Run Mongoose schema validators
            }
        );
        
        return { 
            courseName: result.courseName, 
            status: result ? 'Updated/Created' : 'Failed' 
        };

    } catch (error) {
        console.error(`Error processing student mapping for ${courseName}:`, error);
        throw new Error(`Failed to upload student mapping: ${error.message}`);
    }
}


export default {
    uploadInstructorMapping,
    uploadTAMapping,
    uploadStudentMapping
};