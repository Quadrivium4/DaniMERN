const { Subcourse} = require("../models");
const { requestCourseData, getNewFileName, deleteFile, saveFile} = require("../utils");
const path = require("path");
const { UNAUTHORIZED, RESOURCE_NOT_FOUND } = require("../constants/errorCodes");


const getSubcourse = async (req, res) => {
    const { id } = req.params;
    let user = req.user;
    if (user.role !== "admin" && !user.subcourses.includes(id)) throw new AppError(UNAUTHORIZED, 403, "You are not allowed");
    let subcourse = await Subcourse.findById(id);
    if(!subcourse) throw new AppError(RESOURCE_NOT_FOUND, 404, "No subcourses");
    let data = await requestCourseData(subcourse.hashedId);
    res.send({
        ok: true,
        message: "You got it",
        data: data
    });
}
const getSubcourses = async (req, res) => {
    let user = req.user;
    let subcourses; 
    if(user.role === "admin") subcourses = await Subcourse.find({});
    else {
        subcourses = await Subcourse.find({
            _id: { $in: user.subcourses }
        })
    }
    if(!subcourses) throw new AppError(RESOURCE_NOT_FOUND, 404, "No subcourses Found")
    console.log(`user ${user.name} subcourses`, subcourses);

    res.send({
        ok: true,
        message: "You got it",
        subcourses

    });

    
}
const postSubcourse = async (req, res) => {
    const { name, description, price, hashedId } = req.body;
    let user = req.user
    if (user.role == "admin") {
        const coverImgName = await saveFile(req.files.img, path.join(__dirname, "../public", "images"));
        Subcourse.create({
            name,
            description,
            price,
            hashedId,
            coverImg: coverImgName
        })
        res.send({message: "subcourse created"})
    }

}
const putSubcourse = async (req, res) => {
    console.log("body",req.body);
    console.log("files", req.files);
    const { name, description, price, hashedId, id } = req.body;

    let user = req.user;
    if (user.role == "admin") {
        
        const coverImgName = await saveFile(req.files.coverImg, path.join(__dirname, "../public", "images"));
        let oldSubcourse = await Subcourse.findOneAndUpdate({_id: id},{
            name,
            description,
            price,
            hashedId,
            coverImg: coverImgName
        })
        if(oldSubcourse.coverImg){
            deleteFile(path.join("public", "images", oldSubcourse.coverImg))
        }
        
        console.log("old subcourse:", oldSubcourse);
    }
}
const deleteSubcourse = async (req, res) => {
    const { id } = req.params;
    let user = req.user;
    if (user.role == "admin") {
        let deletedSubcourse = await Subcourse.findOneAndDelete({ _id: id });
        console.log("deleted course:", deletedSubcourse);
    };
}

module.exports = {
    getSubcourse,
    getSubcourses,
    postSubcourse,
    putSubcourse,
    deleteSubcourse
}