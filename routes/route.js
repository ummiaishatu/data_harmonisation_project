const express = require('express');
const router = express.Router();
//const expressError = require('../utils/ExpressError');
const catchAynsc = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');

//add isLoggedIn after editting 
router.get('/help', isLoggedIn,catchAynsc( async (request, response) => {
    //const files = await files.find({});
    response.render('help')
}));

module.exports = router;