const { Subcourse} = require("../models");
const { requestCourseData, } = require("../utils");
const { deleteFile, saveFile } = require("../utils/files");
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
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");
    const fileId = await saveFile(req.files.coverImg);
    Subcourse.create({
        name,
        description,
        price,
        hashedId,
        coverImg: fileId
    })
    res.send({message: "subcourse created"})
}

const putSubcourse = async (req, res) => {
    console.log("body",req.body);
    console.log("files", req.files);
    const { name, description, price, hashedId, id } = req.body;

    let user = req.user;
    if(user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    const fileId = await saveFile(req.files.coverImg);
    let oldSubcourse = await Subcourse.findOneAndUpdate({_id: id},{
        name,
        description,
        price,
        hashedId,
        coverImg: fileId
    })
    if(oldSubcourse.coverImg) await deleteFile(oldSubcourse.coverImg);
    
    console.log("old subcourse:", oldSubcourse);
}
const deleteSubcourse = async (req, res) => {
    const { id } = req.params;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");
    let deletedSubcourse = await Subcourse.findOneAndDelete({ _id: id });
    await deleteFile(deletedSubcourse.coverImg)
    console.log("deleted course:", deletedSubcourse);
}

module.exports = {
    getSubcourse,
    getSubcourses,
    postSubcourse,
    putSubcourse,
    deleteSubcourse
}