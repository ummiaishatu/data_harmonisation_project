const express = require("express");
const passport = require('passport');
const router = express.Router();
//const flash = require('connect-flash');
//const catchAynsc = require('../utils/catchAsync');
const User = require('../models/User.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

router.get('/logout', (request, response) => {
    request.logout();
    //request.flash('success', 'LOGGED OUT!!');
    response.redirect('/');
})



module.exports = router;