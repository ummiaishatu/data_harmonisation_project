const passportLocalMongoose = require('passport-local-mongoose');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String, 
        unique: true,
        required: true 
    },
    first: {
        type: String, 
        unique: true,
        required: true  
    },
    last: {
        type: String, 
        unique: true,
        required: true  
    },
    email: {
        type: String, 
        unique: true,
        required: true 
    },
    number: {
        type: Number, 
        unique: true,
        required: true 
    },
    files: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'file'
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
