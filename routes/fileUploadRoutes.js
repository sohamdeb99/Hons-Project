const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const GenericCsvData = require('../models/GenericCsvData');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        const uploaderUsername = req.body.username || 'Unknown';

        try {
            // Save file data to MongoDB
            const csvData = new GenericCsvData({
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                uploader: uploaderUsername
            });
            await csvData.save();

            // Create a readable stream from the file
            const filePath = path.join(__dirname, '..', req.file.path);
            const fileStream = fs.createReadStream(filePath);

            // Prepare the FormData with the file stream
            const formData = new FormData();
            formData.append('file', fileStream, req.file.originalname);

            // Send the file to the Flask AI service
            const aiResponse = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            res.status(200).json({ message: 'File uploaded and processed', predictions: aiResponse.data });

            // Delete the uploaded file after processing
            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete the file:', err);
            });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Error processing file', error: err });
        }
    } else {
        res.status(400).json({ message: 'No file received' });
    }
});

module.exports = router;
