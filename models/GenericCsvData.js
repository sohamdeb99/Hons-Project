const mongoose = require('mongoose');

const genericCsvDataSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed,
    fileName: String,
    fileType: String,
    uploader: String, 
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GenericCsvData', genericCsvDataSchema);
