const { CONSOLE_COLORS } = require('./constants/consoleColors');
const path = require("path");

function log([...msg], options = {}) {
    color = options.color || "white";
    background = options.background || "black";
    underline = options.underline ? CONSOLE_COLORS.underline : "";
    msg.forEach(message =>{
        if(typeof message === "string")
        console.log(CONSOLE_COLORS.fg[color] +
            CONSOLE_COLORS.bg[background] +
            underline +
            message +
            "\x1b[0m")
        else {
            console.log(message)
        }
    })
    
}
Error.stackTraceLimit = 1;
Error.prepareStackTrace = (_, callSites) =>{
    console.log(_)
    let stack = []
    callSites.forEach(call =>{
        stack.push({
            file: path.basename(call.getFileName()), 
            function: call.getFunctionName(),
            line: call.getLineNumber(),
            path: call.getFileName(),
        })
        console.log(call.getFileName())
    })
    return stack
}
class AppError extends Error {
    constructor(errorCode, statusCode, message) {
        super(message);
        //Error.captureStackTrace(this, AppError);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

global.AppError = AppError
global.logger = log;