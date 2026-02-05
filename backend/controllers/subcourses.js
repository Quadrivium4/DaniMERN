const { Subcourse} = require("../models");
const { requestCourseData, getSubcourseIds, } = require("../utils");
const { deleteFile, saveFile } = require("../utils/files");
const path = require("path");
const { UNAUTHORIZED, RESOURCE_NOT_FOUND } = require("../constants/errorCodes");
const { save } = require("pdfkit");


const getSubcourseInfo = async (req, res) => {
    const { id } = req.params;
    let subcourse = await Subcourse.findById(id);
    if(!subcourse) throw new AppError(RESOURCE_NOT_FOUND, 404, "No subcourses");
    let data = await requestCourseData(subcourse.hashedId);
    console.log("data", data)
    let duration = 0;
    for (let i = 0; i < data.medias.length; i++) {
        const media= data.medias[i];
        duration += media.duration
        
    }
    // for(let media in data.medias){
    //     console.log(media);
    //     duration += media.duration
    // }
    res.send({
        ok: true,
        message: "You got it",
        data: {
            videoNumber: data.medias.length,
            duration: duration
            
        }
    });
}
const getPublicSubcourse =  async (req, res) => {
    const { id } = req.params;
    let user = req.user;

    let subcourse = await Subcourse.findById(id);
    if(!subcourse) throw new AppError(RESOURCE_NOT_FOUND, 404, "No subcourse");
    //let data = await requestCourseData(subcourse.hashedId);
  
        res.send({
            id: subcourse._id,
            coverImg: subcourse.coverImg,
            promoVideo: subcourse.promoVideo,
            promoDescription: subcourse.promoDescription,
            description: subcourse.description,
            name: subcourse.name,
            price: subcourse.price
        });
  

}
const getSubcourse = async (req, res) => {
    const { id } = req.params;
    let user = req.user;
    if (user.role !== "admin" && !user.subcourses.find(e => e.id == id)) {
        throw new AppError(UNAUTHORIZED, 403, "You are not allowed");
    }
    let subcourse = await Subcourse.findById(id);
    if(!subcourse) throw new AppError(RESOURCE_NOT_FOUND, 404, "No subcourses");
    let data = await requestCourseData(subcourse.hashedId);
    if(user.role !== "admin"){
        let progressSubcourse = user.subcourses.find(val => subcourse.id == val.id);
        let duration = data.medias.reduce((prev, current)=> prev +=current.duration);
        console.log("duration",{duration})
        res.send({
            ok: true,
            message: "You got it",
            data: {
                medias: data.medias,
                files: subcourse.files,
                course: {
                    ...subcourse.toObject(),
                    progress: progressSubcourse.progress,
                    total: duration
                }
            }
        });
    }else {
        res.send({
            ok: true,
            message: "You got it",
            data: {
                medias: data.medias,
                files: subcourse.files,
                course: {
                    ...subcourse.toObject(),
                    progress: 0
                }
            }
        });
    }

}
const getSubcourses = async (req, res) => {
    let user = req.user;
    let subcourses; 
    if(user.role === "admin") subcourses = await Subcourse.find({});
    else {
        
        subcourses = await Subcourse.find({
            _id: { $in: getSubcourseIds(user.subcourses) }
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
     console.log("posting subcourse");
    const { name, description, price, hashedId, promoDescription, promoVideo, coverImg} = req.body;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    const subcourse = await Subcourse.create({
        name,
        description,
        price,
        hashedId,
        coverImg,
        promoVideo,
        promoDescription
    })
    res.send({message: "subcourse created", subcourse})
}
const uploadSubcourseFiles = async(req, res) => {
    console.log(req.body);

    const {hashedId, id} = req.body;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    const file = await saveFile(req.files.file);
    let newSubcourse = await Subcourse.findOneAndUpdate({ _id: id }, {
       $push: {[`files.${hashedId}`]: file}
    }, {new: true})
    
    res.send({file});
}
const uploadSubcourseFileIds = async(req, res) => {
    console.log(req.body);

    const {hashedId, id, file} = req.body;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    let newSubcourse = await Subcourse.findByIdAndUpdate(id, {
       $push: {[`files.${hashedId}`]: file}
    }, {new: true})
    
    res.send({newSubcourse});
}
const deleteSubcourseFileIds = async(req, res) =>{
    console.log(req.body, req.query);
    const {hashedId, id, public_id} = req.query;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    let newSubcourse = await Subcourse.findOneAndUpdate({ _id: id }, {
       $pull: {[`files.${hashedId}`]: {public_id}}
    }, {new: true})
    await deleteFile({public_id});
    res.send({subcourse: newSubcourse});
}
const deleteSubcourseFiles = async(req, res) =>{
    console.log(req.body, req.query);
    const {hashedId, id, public_id} = req.query;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    let newSubcourse = await Subcourse.findOneAndUpdate({ _id: id }, {
       $pull: {[`files.${hashedId}`]: {public_id}}
    }, {new: true})
    await deleteFile({public_id});
    res.send({subcourse: newSubcourse});
}
const uploadSubcourseCover = async(req, res) => {
    console.log(req.files, req.body);
    const {id} = req.body;
    let user = req.user;
    if (user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    const file = await saveFile(req.files.coverImg);
    let oldSubcourse = await Subcourse.findByIdAndUpdate(id, {
        coverImg: file
    });
    console.log(oldSubcourse);
    if(oldSubcourse.coverImg) deleteFile(oldSubcourse.coverImg);
    
    res.send({image: file});
}
const putSubcourse = async (req, res) => {
    console.log("body",req.body);
    //console.log("files", req.files);    
    const { name, description, price, hashedId, id, promoVideo, promoDescription, coverImg } = req.body;

    let user = req.user;
    if(user.role !== "admin") throw new AppError(1, 403, "You are not an admin");

    //const file = await saveFile(req.files.coverImg);
    let oldSubcourse = await Subcourse.findOneAndUpdate({_id: id},{
        name,
        description,
        price,
        hashedId,
        coverImg,
        promoDescription,
        promoVideo
    })
    //if(oldSubcourse.coverImg) await deleteFile(oldSubcourse.coverImg);
    
    console.log("old subcourse:", oldSubcourse);
    res.send(oldSubcourse);
    //console.log("new subcourse", )
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
    getPublicSubcourse,
    postSubcourse,
    putSubcourse,
    uploadSubcourseFiles,
    uploadSubcourseCover,
    deleteSubcourse,
    deleteSubcourseFiles,
    getSubcourseInfo,
    uploadSubcourseFileIds
}