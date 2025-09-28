import multer from 'multer';

// Configure disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 'uploads/' is the directory where files will be temporarily stored
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Use the original filename with a timestamp to ensure uniqueness
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Configure Multer to accept a single file named 'file'
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

export default upload;