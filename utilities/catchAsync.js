 module.exports = func => { // accepts a function //
    // returns a new function that has func executed //
    return (req, res, next) => {
        // catches any errors and passes them to next //
        func (req, res, next).catch(next);
    }
 }
 // this will be used to wrap the async functions  in app.js //