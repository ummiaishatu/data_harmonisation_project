/**
 * @filename ExpressError.js
 * @creationdate 2-02-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose defining the error message 
 */
class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;