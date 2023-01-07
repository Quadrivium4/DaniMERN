const express = require('express');
const router = express.Router();
const { login, register, getUser, logout, registerConfirmation} = require("./controllers/user");
const {postCourse, putCourse, getCourse, getCourses, getStore, deleteCourse} = require("./controllers/courses")
const { postSubcourse, putSubcourse, getSubcourse, getSubcourses, deleteSubcourse } = require("./controllers/subcourses");
const { verifyLogin, purchase } = require("./utils");

router.route("/subcourse")
    .get(verifyLogin, getSubcourses)
    .post(verifyLogin, postSubcourse)

router.route("/course")
    .get(verifyLogin, getCourses)
    .post(verifyLogin, postCourse)

router.route("/subcourse/:id")
    .get(verifyLogin, getSubcourse)
    .put(verifyLogin, putSubcourse)
    .delete(verifyLogin, deleteSubcourse)

router.route("/course/:id")
    .get(verifyLogin, getCourse)
    .put(verifyLogin, putCourse)
    .delete(verifyLogin, deleteCourse)

router.route("/store").get(getStore);
router.route("/purchase").post(purchase);
router.route("/verify/:userId/:token").get(registerConfirmation);

router.route("/login").post(login)
router.route("/register").post(register);
router.route("/user").get(verifyLogin, getUser);
router.route("/logout").get(verifyLogin, logout);

module.exports = {
    router
}