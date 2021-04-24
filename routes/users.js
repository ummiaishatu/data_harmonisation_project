const express = require("express");
const passport = require('passport');
const router = express.Router();
const catchAynsc = require('../utils/catchAsync');
const User = require('../models/User');
const File = require('../models/file');
const {isLoggedIn} = require('../middleware');

router.get('/signup', (req, response) => {
    response.render('users/signup');
});

router.post('/signup', catchAynsc ( async( req, response, next) => {
    try{
        const {username,first,last,email,number,password} = req.body;
        //eval(require('locus'));
        const userNew = new User ({username,first,last, email, number});
        await User.register(userNew, password);
        await userNew.save();
        req.flash('success','WELCOME TO HARMONISATION PROJECT');
        response.redirect('myProfile/myProfile'); 

    }catch (e) {
        req.flash('error', e.message);
        response.redirect('signup');
    }
}));

router.get('/login', (req, response) => {
    response.render('users/login')
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), (req, response) => {
    req.flash('success', 'WELCOME BACK!!!');
    const redirectUrl = req.session.returnTo || '/myProfile';
    delete req.session.returnTo;
    response.redirect(redirectUrl);
});


router.get('/myProfile' ,isLoggedIn,catchAynsc( async (request, response) => {
    const user = await User.find({});
    response.render('myProfile/myProfile', {user});
})); 

router.get('/myProfile/:id', isLoggedIn, catchAynsc(async (req, response) => {
    const user = await User.findById(req.params.id)
    response.render('myProfile/account', {user});
}));

router.get('/myProfile/:id/edit', isLoggedIn,catchAynsc( async (request, response) => {
    const user = await User.findById(request.params.id);
    response.render('myProfile/editProfile', {user});
}));

router.put('/myProfile/:id' , isLoggedIn,catchAynsc(async (request, response) => {
    const {id} = request.params;
    const user = await User.findByIdAndUpdate(id, {...request.body.user});
    response.redirect(`/myProfile/${user._id}`);
}));

router.delete('/myProfile/:id', isLoggedIn,catchAynsc(async (request, response) => {
    const {id} = request.params;
    await User.findByIdAndDelete(id);
    response.redirect('/users/login');
}));

module.exports = router;