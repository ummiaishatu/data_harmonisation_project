const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema(
    {
        filePath:String
    },
    {
        timestamps:String
    }, 
    {createAt: {
        type: Date,
        required: true,
        default: Date.now()
    }}
);


module.exports =  mongoose.model('File', FileSchema);