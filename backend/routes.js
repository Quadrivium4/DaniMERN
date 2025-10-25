const express = require('express');
const protectedRouter = express.Router();
const publicRouter = express.Router();

const { login, register, getUser, uploadUserImg, logout, registerConfirmation, uploadUserVideo, deleteUser} = require("./controllers/user");
const {postCourse, putCourse, getCourse, getPublicCourse, getCourses, getStore, deleteCourse, testUpload} = require("./controllers/courses")
const { postSubcourse, putSubcourse, getSubcourse, getSubcourses, deleteSubcourse, uploadSubcourseFiles, deleteSubcourseFiles, uploadSubcourseCover, getSubcourseInfo } = require("./controllers/subcourses");
const {getReviews, postReview, deleteReview, putReview} = require("./controllers/reviews")
const {confirmPaymentIntent,createPaymentIntent, stripeEvents, createPaypalOrder, capturePaypalOrder, approvePaypalOrder, validateCredentials, validateCoupon, pay} = require("./controllers/payment");
const { tryCatch } = require("./utils");
const { verifyUser} = require("./middlewares/verifyUser");
const { errorHandler} = require("./middlewares/errorHandler");
const {downloadFile} = require("./utils/files");
const {createDiscount, getDiscount, getDiscounts, deleteDiscount, updateDiscount} = require("./controllers/discounts");





publicRouter.get("/", (req, res) =>{
    res.send("hello")
})
publicRouter.get('/subcourse/:id', tryCatch(getSubcourseInfo));
publicRouter.get("/files/:id", tryCatch(downloadFile))

protectedRouter.use(tryCatch(verifyUser));
protectedRouter.route("/test-upload").post(tryCatch(testUpload));
protectedRouter.route("/subcourse")
    .get(tryCatch(getSubcourses))
    .post(tryCatch(postSubcourse))
    .put(tryCatch(putSubcourse))
//protectedRouter.route("/pay").get(tryCatch(pay))
protectedRouter.route("/course")
    .get(tryCatch(getCourses))
    .post(tryCatch(postCourse))
    .put(tryCatch(putCourse))

protectedRouter.route("/discount")
    .get(tryCatch(getDiscounts))
    .post(tryCatch(createDiscount))
    .put(tryCatch(updateDiscount))

protectedRouter.route("/review")
    .get(tryCatch(getReviews))
    .post(tryCatch(postReview))
    .put(tryCatch(putReview))

protectedRouter.route("/subcourse/:id")
    .get(tryCatch(getSubcourse))
    .delete(deleteSubcourse)

protectedRouter.route("/course/:id")
    .get(tryCatch(getCourse))
    .delete(tryCatch(deleteCourse))

protectedRouter.route("/review/:id")
    .delete(tryCatch(deleteReview))

protectedRouter.route("/discount/:id")
    .get(tryCatch(getDiscount))
    .delete(tryCatch(deleteDiscount))

protectedRouter.route("/upload-subcourse-files")
    .post(tryCatch(uploadSubcourseFiles))
    .delete(tryCatch(deleteSubcourseFiles));  

protectedRouter.route("/upload-subcourse-cover").post(tryCatch(uploadSubcourseCover));
protectedRouter.route("/user/upload").post(tryCatch(uploadUserImg))
protectedRouter.route("/user/upload/videos").post(tryCatch(uploadUserVideo))
protectedRouter.route("/user")
    .get(tryCatch(getUser))
    .delete(tryCatch(deleteUser))
protectedRouter.route("/logout").get(tryCatch(logout))

publicRouter.route("/validate-coupon").post(tryCatch(validateCoupon))
publicRouter.route("/create-payment-intent").post(tryCatch(createPaymentIntent))
publicRouter.route("/confirm-payment-intent/:id").get(tryCatch(confirmPaymentIntent))

publicRouter.route("/validate-credentials").post(tryCatch(validateCredentials))
publicRouter.route("/create-paypal-order").post(tryCatch(createPaypalOrder));
publicRouter.route("/approve-paypal-order").post(tryCatch(approvePaypalOrder));
publicRouter.route("/capture-paypal-order/:id").get(tryCatch(capturePaypalOrder));

publicRouter.route("/course/:id").get(tryCatch(getPublicCourse));
publicRouter.route("/store").get(tryCatch(getStore));
publicRouter.route("/verify/:userId/:token").get(tryCatch(registerConfirmation))
publicRouter.route("/login").post(tryCatch(login))
publicRouter.route("/register").post(tryCatch(register))
publicRouter.route("/webhook").post(tryCatch(stripeEvents))


module.exports = {
    publicRouter,
    protectedRouter
}