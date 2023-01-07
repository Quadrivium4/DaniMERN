const { User, Course, Subcourse} = require("../models");
const {requestCourseData} = require("../utils");
const getStore = async (req, res) => {
    const store = [];
    const courses = await Course.find({});
    courses.forEach(course => {
        store.push({
            name: course.name,
            description: course.description,
            price: course.price,
            id: course._id
        })
    })
    res.send({
        ok: true,
        courses: store
    });
}
const getCourses = async (req, res) => {
    let user = await User.findOne({
        email: req.session.userEmail
    })
    if (user) {
        if (user.role == "admin") {
            console.log(req.query)
            let subcourses = [];
            let course = await Course.findById(id);
            if (course) {
                for (let i = 0; i < course.subcourses.length; i++) {
                    let subcourse = course.subcourses[i];
                    let wistiaSubcourse = await requestCourseData(subcourse.token, subcourse.hashedId);
                    subcourses.push(wistiaSubcourse);
                }
                console.log(subcourses)
                res.send({
                    ok: true,
                    message: "You got it",
                    data: subcourses
                });
            } else {
                res.send({
                    ok: false,
                    message: "Course not found!",
                })
            }
        } else {
            console.log("not allowed")
            res.send({
                ok: false,
                message: "You are not allowed!",
            })
        }
    }
}
const getCourse = async (req, res) => {
    ;
    const { id } = req.params;
    let user = await User.findOne({
        email: req.session.userEmail
    })
    if (user) {
        if (user.role == "admin" || user.courses.includes(id)) {
            let subcourses = [];
            let course = await Course.findById(id);
            if (course) {
                for (let i = 0; i < course.subcourses.length; i++) {
                    let subcourseId = course.subcourses[i];
                    let subcourse = await Subcourse.findById(subcourseId);
                    let wistiaSubcourse = await requestCourseData(subcourse.token, subcourse.hashedId);
                    wistiaSubcourse.medias.forEach(video => {
                        subcourses.push(video);
                    })
                }
                console.log(subcourses)
                res.send({
                    ok: true,
                    message: "You got it",
                    data: subcourses
                });
            } else {
                res.send({
                    ok: false,
                    message: "Course not found!",
                })
            }
        } else {
            console.log("not allowed")
            res.send({
                ok: false,
                message: "You are not allowed!",
            })
        }
    }
}
const postCourse = async (req, res) => {
    const { name, description, price, subcourses } = req.body;
    let user = await User.findOne({
        email: req.session.userEmail
    });
    if (user) {
        if (user.role == "admin") {
            Course.create({
                name,
                description,
                price,
                subcourses
            })
        };

    }
}
const putCourse = async (req, res) => {
    const { name, description, price, subcourses } = req.body;
    const {id} = req.params;
    let user = await User.findOne({
        email: req.session.userEmail
    });
    if (user) {
        if (user.role == "admin") {
            let updatedCourse = await Course.findOneAndUpdate({_id: id},{
                name,
                description,
                price,
                subcourses
            }, {
                new: true
            });
            console.log("updatet course:", updatedCourse);
        };

    }
}
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    let user = await User.findOne({
        email: req.session.userEmail
    });
    if (user) {
        if (user.role == "admin") {
            let deletedCourse = await Course.findOneAndDelete({ _id: id });
            console.log("deleted course:", deletedCourse);
        };
    }
}
module.exports = {
    getCourse,
    getCourses,
    postCourse,
    putCourse,
    getStore,
    deleteCourse
}