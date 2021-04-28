/**
 * @filename csvParent.js
 * @creationdate 26-04-2021
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose   * This is the one to many relationship model between the 
 * user and the files being uploaded. 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CsvParentSchema = new Schema({
    file_path: {
        type: String, 
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('CsvParent', CsvParentSchema);
