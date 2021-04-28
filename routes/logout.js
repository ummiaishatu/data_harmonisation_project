/**
 * @filename logout.js
 * @creationdate 30-03-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose  * This is where the user is logged out 
 */
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require('../models/User.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @GET method 
 * logs out the user and redirects them to home page 
 */
router.get('/logout', (request, response) => {
    request.logout();
    //request.flash('success', 'LOGGED OUT!!');
    response.redirect('/');
})



module.exports = router;