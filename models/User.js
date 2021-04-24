const passportLocalMongoose = require('passport-local-mongoose');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String, 
        unique: true 
    },
    first: {
        type: String, 
        unique: true 
    },
    last: {
        type: String, 
        unique: true 
    },
    email: {
        type: String, 
        unique: true 
    },
    number: {
        type: Number, 
        unique: true 
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
