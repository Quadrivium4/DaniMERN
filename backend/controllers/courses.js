const { User, Course, Subcourse} = require("../models");
const {requestCourseData, getNewFileName,deleteFile, saveFile} = require("../utils");
const path = require("path");
const fs = require("fs");
const { UNAUTHORIZED, RESOURCE_NOT_FOUND } = require("../constants/errorCodes");
const getStore = async (req, res) => {
    const store = [];
    const courses = await Course.find({});
    for (const course of courses) {
        let subcourses = [];
        for  (const subcourseId of course.subcourses) {
            let subcourseData = await Subcourse.findById(subcourseId);
            let subcourse = {
                id: subcourseData._id,
                name: subcourseData.name,
                description: subcourseData.description,
                price: subcourseData.price,
                coverImg: subcourseData.coverImg,
                videos: [],
                duration: 0
            }
            subcourses.push(subcourse);
        }
        course.subcourses = subcourses;
        store.push({
            name: course.name,
            description: course.description,
            price: course.price,
            coverImg: course.coverImg,
            id: course._id,
            subcourses: subcourses
        })
    }
    res.send({
        ok: true,
        courses: store
    });
}
const getPublicCourse   = async (req, res) => {
    const { id } = req.params;
    let subcourses = [];
    let course = await Course.findById(id);
    if(!course) throw new AppError(RESOURCE_NOT_FOUND, 404, "Course not found");
    for (let i = 0; i < course.subcourses.length; i++) {
        let subcourseId = course.subcourses[i];
        let subcourse = await Subcourse.findById(subcourseId);
        let wistiaSubcourse = await requestCourseData(subcourse.hashedId);
        //console.log("wistia", wistiaSubcourse)
        wistiaSubcourse.medias.forEach(video => {
            subcourses.push({
                id: video.id,
                name: video.name,
                description: video.description,
                duration: video.duration
            });
        })
    }
    course.subcourses = subcourses;
    res.send({
        ok: true,
        message: "You got it",
        data: course
    });
}
const getCourses = async (req, res) => {
    const user = req.user;
    let courses;
    if (user.role == "admin") courses = await Course.find({}); 
    else { 
        courses = await Course.find({
            _id: {$in: user.courses}
        })
    }
    if (!courses) throw new AppError(RESOURCE_NOT_FOUND, 404, "No courses found");
    res.send({
        ok: true,
        message: "You got it",
        courses
    });
}
const getCourse = async (req, res) => {

    const { id } = req.params;
    let user = req.user;
    if (!user.role == "admin" && !user.courses.includes(id)) {
        return new AppError(UNAUTHORIZED, 403, "You are not allowed")
    }
    let subcourses = [];
    let course = await Course.findById(id);
    if (!course) return new AppError(RESOURCE_NOT_FOUND, 403, "You are not allowed")

    for (let i = 0; i < course.subcourses.length; i++) {
        let subcourseId = course.subcourses[i];
        let subcourse = await Subcourse.findById(subcourseId);
        let wistiaSubcourse = await requestCourseData(subcourse.hashedId);
        wistiaSubcourse.medias.forEach(video => {
            subcourses.push(video);
        })
    }
    course.subcourses = subcourses;
    res.send({
        ok: true,
        message: "You got it",
        data: course
    });
}
const postCourse = async (req, res) => {
    console.log(req.body, req.files)
    let { name, description, price, subcourses } = req.body;
    subcourses = JSON.parse(subcourses);
    let user = req.user;
    if (user.role == "admin") {
        let coverImgName = await saveFile(req.files.coverImg, path.join("public", "images"));
        Course.create({
            name,
            description,
            price,
            subcourses,
            coverImg: coverImgName
        })
    };
}
const putCourse = async (req, res) => {
    let { name, description, price, subcourses, id} = req.body;
    subcourses = JSON.parse(subcourses);
    let user = req.user;
    if (user.role == "admin") {
        let coverImgName = await saveFile(req.files.coverImg, path.join("public", "images"))
        let oldCourse = await Course.findOneAndUpdate({_id: id},{
            name,
            description,
            price,
            subcourses,
            coverImg: coverImgName
        });
        deleteFile(path.join("public", "images", oldCourse.coverImg))
        console.log("old course:", oldCourse);
    };
}
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    let user = req.user;
    if (user.role == "admin") {
        let deletedCourse = await Course.findOneAndDelete({ _id: id });
        console.log("deleted course:", deletedCourse);
    };
}
const testUpload = async (req, res) => {
    console.log(req.files);
    console.log(req.body)
    //const { name, description, price, subcourses, id, coverImg } = req.body;
    //const coverImg = req.files.img;
    /*console.log("coverImg", coverImg)
    const coverImgName = getNewFileName(coverImg.name);
    const filePath = path.join("public", "images", coverImgName);
    let user = await User.findOne({
        email: req.session.userEmail
    });
    if (user) {
        console.log({ filePath, coverImgName, coverImg })

            file.mv(filePath, err => {
                if (err) return res.status(500).send(err);
                res.send({ coverImgName });
            })
        };*/
    res.send({ok: true});
}

module.exports = {
    getCourse,
    getPublicCourse,
    getCourses,
    postCourse,
    putCourse,
    getStore,
    deleteCourse,
    testUpload
}