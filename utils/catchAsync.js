/**
 * @filename catchAsync.js
 * @creationdate 2-02-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose catching errors and rendering on web page 
 */
module.exports = func => {
    return (request, response, next ) => {
        func(request, response, next).catch(next);
    }
}