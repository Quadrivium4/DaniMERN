const { User, Course, Subcourse, UnverifiedUser } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const SALT_ROUNDS = 10;
const { validateEmail, sendMail } = require("../utils");

const login = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    console.log(req.body);
    console.log(email, password);
    let user = await User.findOne({
        email: email,
    })
    if (user) {
        console.log(user)
        bcrypt.compare(password, user.password, (err, result) => {
            console.log(err)
            if (err) return res.send({ ok: false, message: "Error occured, try again", error: err });
            if (!result) return res.send({ ok: false, message: "Incorrect password" })
            else {
                req.session.userEmail = email;
                return res.send({ ok: true, message: "User found", role: user.role })
            }
        })
    } else {
        return res.send({
            ok: false,
            message: `user with that email not found`,
        })
    }
}
const getUser = async (req, res) => {
    let user = await User.findOne({
        email: req.session.userEmail
    })
    if (user) {
        let courses;
        let subcourses;
        if (user.role == "admin") {
            courses = await Course.find({});
            subcourses = await Subcourse.find({})
        } else {
            console.log(user.courses)
            courses = await Course.find({
                _id: { $in: user.courses }
            });
            subcourses = await Subcourse.find({
                _id: { $in: user.subcourses }
            })
        }
        return res.send({
            ok: true,
            message: `user found`,
            user: user,
            role: user.role,
            courses: courses,
            subcourses: subcourses
        });
    } else {
        res.send({
            ok: false,
            message: "user not found"
        })
    }
}
const registerConfirmation = async (req, res) => {
    const { userId, token } = req.params;
    const user = await UnverifiedUser.findOne({ _id: userId });
    console.log(user, userId, token)
    if (!user) return res.status(400).send({ ok: false, message: "invalid link" });
    const unverifiedUser = await UnverifiedUser.findOne({
        _id: userId,
        token: token
    });
    if (token) {
        const verifiedUser = await User.create({
            name: unverifiedUser.name,
            email: unverifiedUser.email,
            password: unverifiedUser.password
        })
        UnverifiedUser.findOneAndDelete({
            _id: unverifiedUser._id
        })
        console.log("user verified", verifiedUser);
        req.session.userEmail = verifiedUser.email;
        let redirectUrl = req.protocol + "://" + req.get("host") + "/dashboard";
        console.log("redirecting...", redirectUrl)
        res.redirect( redirectUrl);
    } else {
        return res.status(400).send({ ok: false, message: "invalid link" });
    }
}
const register = async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;
    let user = await User.findOne({
        email: email
    })
    if (name.trim() == "") return res.send({ ok: false, message: "invalid name" })
    else if (!validateEmail(email)) return res.send({ ok: false, message: "invalid email" })
    else if (user) return res.send({ ok: false, message: "this user alread exists" })
    else if (password.trim().length <= 6) return res.send({ ok: false, message: "password must be more than 6 characters long" })
    else {
        bcrypt.hash(password, SALT_ROUNDS, async function (err, hash) {
            if (err) {
                return res.send({
                    ok: false,
                    message: "Error occured, try again"
                });
            }
            const unverifiedUser = await UnverifiedUser.create({
                name: name,
                email: email,
                password: hash,
                token: crypto.randomBytes(32).toString("hex")
            });
            sendMail(`
                click link below to confirm:
                <a href="${process.env.BASE_URL + "verify/" + unverifiedUser._id + "/" + unverifiedUser.token}">confirm</a>
            `, unverifiedUser.email, "verification email").then(result => {
                console.log("Email sent...", result);
            }).catch(err => {
                console.log(err);
            })
            res.send({
                ok: true,
                message: "Succesfully registered! We sent you an email!"
            })
        });
    }
}
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send({
                message: "cannot log out"
            })
        }
        res.send({
            message: "succesfully logged out"
        })
    })
}
module.exports = {
    login,
    getUser,
    register,
    registerConfirmation,
    logout
}