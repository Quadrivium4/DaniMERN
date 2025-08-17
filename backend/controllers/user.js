require("dotenv").config();
const { User, Course, Subcourse, Review, UnverifiedUser } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const SALT_ROUNDS = 10;
const { validateEmail, sendMail, getNewFileName, uploadWistiaVideo} = require("../utils");
const {deleteFile, getFile, saveFile} = require("../utils/files");
const {deleteCustomer} = require("../utils/stripe");

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
        bcrypt.compare(password, user.password, async(err, result) => {
            console.log(err)
            if (err) return res.status(500).send({ ok: false, message: "Error occured, try again", error: err });
            if (!result) return res.status(401).send({ ok: false, message: "Incorrect password" })
            else {
                req.session.userEmail = email;
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
                return res.send({ ok: true, message: "User found", user: user, courses, subcourses})
            }
        })
    } else {
        return res.status(401).send({
            ok: false,
            message: `user with that email not found`,
        })
    }
}
const uploadUserImg = async(req, res) =>{
    const user = req.user;
    const email = user.email;
    const fileId = await saveFile(req.files.file)
    const newUser = await User.findOneAndUpdate({ email }, {
        profileImg: fileId
    }, {
        new: true
    });
    if (user.profileImg) await deleteFile(user.profileImg);
    console.log(newUser);
    res.send({fileId})
}
const uploadUserVideo = async (req, res) => {
    const email = req.session.userEmail;
    const user = await User.findOne({email});
    if(!user) return res.status(401).send({ok: false, message: "user not found" });
    if (user.allowedReviews < 1) return res.status(403).send({ ok: false, message: "you have no allowed reviews" });
    const file = req.files.file;
    const {description} = req.body;
    console.log("Uploading video...");
    const data =  await uploadWistiaVideo(file);
    if(data){
        console.log(data);
        const videoName = path.parse(path.basename(data.name)).name;
        const review = await Review.create({
            description,
            userId: user._id,
            video: {
                name: videoName,
                duration: data.duration,
                hashedId: data.hashed_id,
                previewImg: data.thumbnail.url
            }
        })
        console.log(review)
        console.log(user, "reviewsss", user.reviews)
        let reviews = user.reviews;
        reviews.push(review._id.toString());
        const updatedUser = await User.findByIdAndUpdate(user._id,{
            allowedReviews: user.allowedReviews - 1, 
            reviews
            
        }, {
            new: true
        });
        /*sendMail(`
            Hi Dani,
            ${user.name} wants a feedback from you!
            <a href="${process.env.CLIENT_URL}">Give It!</a>
        `, "miguelgiacobbe@gmail.com", "New Review Request!").then(result =>{
            console.log("email sent", result)
        }).catch(err=>{
            console.log("ops error!", err)
        })*/
        //console.log(updatedUser)
    }
    
    /*const email = req.session.userEmail;
    const file = req.files.file;
    const fileName = getNewFileName(file.name);
    const oldUser = await User.findOneAndUpdate({ email }, {
        profile_img: fileName
    });
    console.log(oldUser);
    console.log(fileName)
    if (oldUser.profileImg) {
        deleteFile(path.join("public", "users", "images", oldUser.profileImg));
    }


    const filePath = path.join("public", "users", "images", fileName);

    file.mv(filePath, err => {
        if (err) return res.status(500).send(err);
        res.send({ fileName });
    })*/
}
const getUser = async (req, res) => {
    const user = req.user;
    let courses;
    let subcourses;
    if (user.role == "admin") {
        courses = await Course.find({});
        subcourses = await Subcourse.find({})
    } else {
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

}
const registerConfirmation = async (req, res) => {
    const { userId, token } = req.params;
    const unverifiedUser = await UnverifiedUser.findOne({
        _id: userId,
        token: token
    });
    if (unverifiedUser) {
        const verifiedUser = await User.create({
            name: unverifiedUser.name,
            email: unverifiedUser.email,
            password: unverifiedUser.password
        });
        
        const deletedUser = await UnverifiedUser.findOneAndDelete({
            _id: unverifiedUser._id
        })
        console.log("unverified user deleted:", deletedUser)
        console.log("user verified", verifiedUser);
        req.session.userEmail = verifiedUser.email;
        let redirectUrl = process.env.CLIENT_URL + "verified";
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
    console.log("try logout")
    req.session.destroy(err => {
        if (err) {
            return res.send({
                ok: false,
                message: "cannot log out"
            })
        }
        res.send({
            ok: true,
            message: "succesfully logged out"
        })
    })
}
const deleteUser = async(req, res) =>{
    const user = req.user;
    const deletedUser = await User.findByIdAndDelete(user._id);
    const reviews = await Review.find({ _id: { $in: user.reviews } })
    reviews.forEach(review=>{
        deleteFile(review.pdf)
    })
    const deletedReviews = await Review.deleteMany({ _id: { $in: user.reviews } });
    const deletedCustomer = await deleteCustomer(user.stripeId);

    req.session.destroy(err => {
        if (err) {
            return res.send({
                ok: false,
                message: "cannot log out"
            })
        }
    })
    console.log("User deleted succesfully!")
    res.send({ok: true, message: "User deleted succesfully!"})
}
module.exports = {
    login,
    getUser,
    uploadUserImg,
    uploadUserVideo,
    register,
    registerConfirmation,
    logout,
    deleteUser
}