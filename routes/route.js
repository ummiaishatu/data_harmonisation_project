/**
 * @filename route.js
 * @creationdate 30-03-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose   * This is where to get render the help page 
 */

const express = require('express');
const router = express.Router();
const catchAynsc = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');

/**
 * @GET method 
 * to get the help page 
 */
router.get('/help', isLoggedIn,catchAynsc( async (request, response) => {
    response.render('help')
}));

module.exports = router;