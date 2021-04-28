/**
 * @filename middleware.js
 * @creationdate 2-02-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose to authenticate the user, do not allow user into 
 * certain pges unless they are logged in. 
 */
module.exports.isLoggedIn = (request, response, next) => {
    if(!request.isAuthenticated()){
        //request.session.returnTo = requesy.originalUrl;
        //request.flash('error', 'you must be signed in')
        return response.redirect('/login');
    }
    next();
}
