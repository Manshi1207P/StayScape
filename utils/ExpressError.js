class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
module.exports=ExpressError;


// class ExpressError extends Error
// This line defines a new class called ExpressError.
// It extends the built-in JavaScript Error class.
// By extending Error, ExpressError inherits the properties and behavior of standard errors
//  in JavaScript.