const { NOT_LOGGED_IN, USER_NOT_FOUND}  = require("../constants/errorCodes");
const {User} = require("../models");
const verifyUser = async (req, res, next) => {
    const email = req.session.userEmail;
    //console.log({email: req.session.userEmail})
    if (!email) throw new AppError(NOT_LOGGED_IN, 403, "You should be logged in");
    const user = await User.findOne({ email });
    if (!user) throw new AppError(USER_NOT_FOUND, 404, "User not found");
    req.user = user;
    next()
}
module.exports = {
    verifyUser
}