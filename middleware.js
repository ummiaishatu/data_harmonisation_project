module.exports.isLoggedIn = (request, response, next) => {
    if(!request.isAuthenticated()){
        //request.session.returnTo = requesy.originalUrl;
        //request.flash('error', 'you must be signed in')
        return response.redirect('/login');
    }
    next();
}
