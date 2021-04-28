/**
 * @filename file.js
 * @creationdate 19-04-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose  This is model for the all the files paths that have 
 * been uploaded to the database. this is what they consist of. 
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema(
    {
        filePath:String
    },
    {
        timestamps:String
    }, 
    {
        createAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports =  mongoose.model('File', FileSchema);