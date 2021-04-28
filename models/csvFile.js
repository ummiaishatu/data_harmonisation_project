/**
 * @filename csvFile.js
 * @creationdate 26-04-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose  This is the model for the uploaded file Content 
 * including the parent which involved the file and the user assigned to 
 * those files
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CsvFileSchema = new Schema({
    csvId: {
        type: String, 
        required: true 
    },
    first_name: {
        type: String, 
        required: true  
    },
    last_name: {
        type: String, 
        required: true  
    },
    email: {
        type: String, 
        required: true 
    },
    gender: {
        type: String,
        required: true
    },
    ip_address: {
        type:String,
        required:true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CsvParent'
    }
});


module.exports = mongoose.model('CsvFile', CsvFileSchema);
