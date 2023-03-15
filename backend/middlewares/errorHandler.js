const { sendMail } = require("../utils");

const errorHandler = async (err, req, res, next) => {
    console.log("error handler")
    if(err instanceof AppError){
        //console.log("My Error", err.stack)
        logger(["---- Is Not Your Fault ----", {
            type: err.constructor.name,
            statusCode: err.statusCode,
            errorCode: err.errorCode,
            message: err.message,
            location: err.stack
        }], {
            background: "red",
        })
        return res.status(err.statusCode).send({
            message: err.message, 
            errorCode: err.errorCode
        });
    }
    
    logger(["---- You Are Stupid ----", {
        type: err.constructor.name,
        message: err.message,
        location: err.stack
    }], {
        background: "red",
    })
    //await sendMail("Your Programmer Is Stupid, please contact him to fix the bug!", "miguelgiacobbe@gmail.com", "Server Crashed")
    res.status(500).send("Something went wrong!");
    process.exit(1);
}
module.exports = errorHandler