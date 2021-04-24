const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    file: {
        type: Buffer,
        unique: true
    },
    fileType: {
        type: String,
        unique: true
    }
});

FileSchema.virtual('filePath').get(function(){
    if(this.file != null && this.fileType != null){
        return `data:${this.fileType};charset=utf-8;base64,${this.file.toString('base64')}`;
    }
})


module.exports =  mongoose.model('File', FileSchema);