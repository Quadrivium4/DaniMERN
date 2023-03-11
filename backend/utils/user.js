const { User }  = require("../models");
const {validateEmail} = require("../utils")
const bcrypt = require("bcrypt");



const register = async (name, email, password) => {
    console.log({credentials: {name, email, password}});
    let user = await User.findOne({
        email: email
    })
    if (name.trim() == "") throw new AppError(1, 401,"Invalid name" )
    else if (!validateEmail(email)) throw new AppError(1, 401,"Invalid email" )
    else if (user) throw new AppError(1, 401,"This user already exists, login instead" )
    else if (password.trim().length <= 6) {
        console.log()
        throw new AppError(1, 401,"Password must be more than 6 characters long" );
    }
    else {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }
}
module.exports = {
    register
}