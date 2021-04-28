/**
 * @filename users.js
 * @creationdate 30-03-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose   * This is where the resgistration of new user 
 * and logging in of old user takes place 
 */
const express = require("express");
const passport = require('passport');
const router = express.Router();
const catchAynsc = require('../utils/catchAsync');
const User = require('../models/User');

/**
 * @GET method 
 * this gets the signup page
 */
router.get('/signup', (req, response) => {
    response.render('users/signup');
});

/**
 * @POST method 
 * this is where the registering for the user takes place 
 * after registering it then sends the user back to login 
 * to confirm his / her details. 
 */
router.post('/signup', catchAynsc ( async( request, response, next) => {
    try{
        const {username,first,last,email,number,password} = request.body;
        const userNew = new User ({username,first,last, email, number});
        await User.register(userNew, password);
    }catch (e) {
        request.flash('error', e.message);
        //console.log(e);
        response.redirect('signup');
    }
    request.flash('success','WELCOME TO HARMONISATION PROJECT');
    response.redirect('myProfile'); 
}));

/**
 * @GET method 
 * this gets the login page
 */
router.get('/login', (req, response) => {
    response.render('users/login')
});

/**
 * @POST method 
 * this is where the user logins and be redirected to the profile page.  
 */
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), (req, response) => {
    req.flash('success', 'WELCOME BACK!!!');
    const redirectUrl = req.session.returnTo || '/myProfile';
    delete req.session.returnTo;
    response.redirect(redirectUrl);
});

module.exports = router;