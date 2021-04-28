/**
 * @filename User.js
 * @creationdate 19-04-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose  * This is the model for user, the login and the signup page both use 
 * the same model
 * where the user credentials are stored
 */
const passportLocalMongoose = require('passport-local-mongoose');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String, 
        required: true 
    },
    first: {
        type: String, 
        required: true  
    },
    last: {
        type: String, 
        required: true  
    },
    email: {
        type: String, 
        required: true 
    },
    number: {
        type: Number, 
        required: true 
    },
    files: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
