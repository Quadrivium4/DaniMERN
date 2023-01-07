const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        rquired: true
    },
    role:{
        type: String,
        default: "common"
    },
    courses: {
        type: Array,
        default: []
    },
    subcourses: {
        type: Array,
        default: []
    }
});
const User = mongoose.model("User", UserSchema);

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    subcourses: {
        type: Array,
        default: []
    }
});
const Course = mongoose.model("Course", CourseSchema);

const SubcourseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    hashedId: {
        type: String,
        required: true
    }
});
const Subcourse = mongoose.model("Subcourse", SubcourseSchema);

const UnverifiedUserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        rquired: true
    },
    token: {
        type: String,
        required: true
    }
});
const UnverifiedUser = mongoose.model("UnverifiedUser", UnverifiedUserSchema);
module.exports ={
    User,
    Course,
    Subcourse,
    UnverifiedUser
}