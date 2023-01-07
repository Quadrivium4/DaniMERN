const { User,Subcourse} = require("../models");
const { requestCourseData } = require("../utils");

const getSubcourse = async (req, res) => {
    const { id } = req.params;
    let user = await User.findOne({
        email: req.session.userEmail
    })
    if (user) {
        if (user.role == "admin" || user.subcourses.includes(id)) {
            console.log(req.query)
            let subcourse = await Subcourse.findById(id);
            let data = await requestCourseData(subcourse.token, subcourse.hashedId);
            res.send({
                ok: true,
                message: "You got it",
                data: data
            });
        } else {
            console.log("not allowed")
            res.send({
                ok: false,
                message: "You are not allowed!",
            })
        }
    }
}
const getSubcourses = async (req, res) => {
    let user = await User.findOne({
        email: req.session.userEmail
    })
    if (user) {
        if (user.role == "admin") {
            let wistia = [];
            let subcourses = await Subcourse.find({});
            console.log(subcourses)
            for (let i = 0; i < subcourses.length; i++) {
                let subcourse = subcourses[i];
                let wistiaSubcourse = await requestCourseData(subcourse.token, subcourse.hashedId);
                wistia.push(wistiaSubcourse);
            }

            res.send({
                ok: true,
                message: "You got it",
                data: {
                    wistia,
                    db: subcourses
                }
            });
        }

    }
}
const postSubcourse = async (req, res) => {
    const { name, description, price, token, hashedId } = req.body;
    let user = await User.findOne({
        email: req.session.userEmail
    });
    if (user) {
        if (user.role == "admin") {
            Subcourse.create({
                name,
                description,
                price,
                token,
                hashedId
            })
        }

    }
}
const putSubcourse = async (req, res) => {
    const { name, description, price, token, hashedId } = req.body;
    const {id} = req.params;
    let user = await User.findOne({
        email: req.session.userEmail
    });
    console.log()
    if (user) {
        if (user.role == "admin") {
            let updatedSubcourse = await Subcourse.findOneAndUpdate({_id: id},{
                name,
                description,
                price,
                token,
                hashedId
            },{
                new: true
            })
            console.log("updatet subcourse:", updatedSubcourse);
        }

    }
}
const deleteSubcourse = async (req, res) => {
    const { id } = req.params;
    let user = await User.findOne({
        email: req.session.userEmail
    });
    if (user) {
        if (user.role == "admin") {
            let deletedSubcourse = await Subcourse.findOneAndDelete({ _id: id });
            console.log("deleted course:", deletedSubcourse);
        };
    }
}

module.exports = {
    getSubcourse,
    getSubcourses,
    postSubcourse,
    putSubcourse,
    deleteSubcourse
}