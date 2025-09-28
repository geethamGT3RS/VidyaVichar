import express from 'express';

//Import the packages for parsing CSV files
import fs from 'fs';
import csv from 'csv-parser';
import upload from '../middleware/upload'; // Middleware to handle file uploads

const { 
    uploadInstructorMapping,
    uploadTAMapping,        // ADDED
    uploadStudentMapping    // ADDED
} = require('../controllers/courseAdminController');

const router = express.Router();


/**
 * Helper function to handle the common CSV parsing and DB update logic.
 * @param {string} filePath - Path to the temporary uploaded CSV file.
 * @param {Array<string>} headers - Expected header names for the CSV file.
 * @param {function} dbMapperFunction - The Mongoose controller function to call per row.
 * @param {boolean} requiresDescription - Flag to check for 'courseDesc' field.
 * @returns {Promise<Object>} - Summary of the upload results.
 */
const processUpload = (filePath, headers, dbMapperFunction, requiresDescription) => {
    return new Promise((resolve, reject) => {
        const results = [];
        let successCount = 0;
        let errorCount = 0;

        fs.createReadStream(filePath)
            .pipe(csv({ headers: headers, skipLines: 1 }))
            .on('data', (row) => {
                const courseName = row[headers[0]];
                const courseDesc = requiresDescription ? row[headers[1]] : null;
                const email = requiresDescription ? row[headers[2]] : row[headers[1]];

                // Check for core required fields
                if (!courseName || !email) {
                    results.push({ row, status: 'Error: Missing Course Name or Email' });
                    errorCount++;
                    return;
                }

                // Prepare arguments based on the required function
                const args = requiresDescription 
                    ? [courseName, courseDesc, email] 
                    : [courseName, email];

                // Call the specific Mongoose controller function
                dbMapperFunction(...args)
                    .then(result => {
                        results.push({ row, status: 'Success', dbResult: result });
                        successCount++;
                    })
                    .catch(err => {
                        results.push({ row, status: `Error: ${err.message}` });
                        errorCount++;
                    });
            })
            .on('end', () => {
                // Clean up the temporary file synchronously
                try {
                    fs.unlinkSync(filePath); 
                } catch (e) {
                    console.error("Failed to delete temp file:", e);
                }
                
                // Note: In a real app, you would use Promise.all to wait for all DB operations
                // to resolve before summarizing. For this example, we return an immediate summary.
                resolve({
                    message: 'Processing complete.',
                    summary: `Processed ${successCount + errorCount} rows. Success: ${successCount}, Errors: ${errorCount}.`,
                    details: results // Useful for debugging
                });
            })
            .on('error', (err) => {
                reject({ message: 'Error reading CSV file.', error: err.message });
            });
    });
};


// 1. INSTRUCTOR UPLOAD ROUTE 
router.post('/upload/instructors', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const headers = ['courseName', 'courseDesc', 'instructorEmail'];
        // Use req.file.path to get the temporary file path from Multer
        const result = await processUpload(
            req.file.path, 
            headers, 
            uploadInstructorMapping, 
            true // requiresDescription = true
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});


// 2. TA UPLOAD ROUTE 
router.post('/upload/tas', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Expected format: <course name>,<taEmail>
        const headers = ['courseName', 'taEmail']; 
        // Use req.file.path to get the temporary file path from Multer
        const result = await processUpload(
            req.file.path, 
            headers, 
            uploadTAMapping, 
            false // requiresDescription = false
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});


// 3. STUDENT UPLOAD ROUTE 
router.post('/upload/students', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Expected format: <course name>,<studentEmail>
        const headers = ['courseName', 'studentEmail'];
        // Use req.file.path to get the temporary file path from Multer
        const result = await processUpload(
            req.file.path, 
            headers, 
            uploadStudentMapping, 
            false // requiresDescription = false
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});


export default router;