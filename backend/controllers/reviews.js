const path = require('path');
const fs = require('fs');
const { User, Review} = require("../models");
const {download, createPdfReview, getNewFileName, deleteWistiaVideo} = require("../utils");
const { deleteFile } = require('../utils/files');
const getReviews = async(req, res) =>{
    const user = req.user;
    let reviews;
    if (user.role === "admin") reviews = await Review.find({});
    else {
        reviews = await Review.find({_id:{$in: user.reviews} });
    }
    res.send({
        ok: true,
        reviews
    })
        
}
const deleteReview = async(req, res) =>{
    const {id} = req.params;
    const user = req.user;
    let deletedReview;
    if(user.role === "admin") deletedReview = await Review.findByIdAndDelete(id);
    if(user.reviews.includes(id)){
        deletedReview = await Review.findByIdAndDelete(id);
        const newUserReviews = user.reviews.filter(review => review !== id);
        if (deleteReview.pdf) await deleteFile(deletedReview.pdf)
        
        User.findByIdAndUpdate(user._id, {
            reviews: newUserReviews
        })
    }
    await deleteWistiaVideo(deletedReview.video.hashedId);
    console.log({deletedReview});
    res.send({message: "Review deleted succesfully"});
}
const putReview = async (req, res) => {a
    console.log("put")
    const { id } = req.params;

}
const postReview = async (req, res) => {
    const user = req.user;
    const {id, fields, priceRange, comment } = req.body;
    const review = await Review.findById(id);
    const reviewedUser = await User.findById(review.userId);
    if (!user.role === "admin") return res.status(401).send({ ok: false, message: "not allowed" });
    const image = await download(review.video.previewImg);
    const videoName = path.parse(path.basename(review.video.name)).name;
    const pdfId = await createPdfReview(videoName,videoName, reviewedUser.name, image, fields, priceRange, comment);
    console.log("pdf result", {pdfId})
    const updatedReview = await Review.findByIdAndUpdate(id,{
        completed: true,
        pdf: pdfId
    }, {
        new: true
    })
    const deletedVideo = await deleteWistiaVideo(review.video.hashedId);
    //console.log("deleted video", deletedVideo);
    //console.log("updated review", updatedReview)
    
    

}


module.exports = {
    getReviews,
    putReview,
    deleteReview,
    postReview
}