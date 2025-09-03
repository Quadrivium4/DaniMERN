require("dotenv").config()
const {bucket} = require("../db");
const {Readable} = require("stream");
const { ObjectId } = require("mongodb");
const { v2: cloudinary} = require("cloudinary");

//const cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const saveFile = async(file)=>{
<<<<<<< HEAD
    console.log("saving file.. " + file.name);
    const b64 = Buffer.from(file.data).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
   // console.log({dataURI, b64, mimetype: file.mimetype, name: file.name})
    const result = await cloudinary.uploader.upload(dataURI);
    console.log(result);
    return {
        url: result.url,
        name: file.name,
        public_id: result.public_id
    }
    // let stream = Readable.from(file.data);
    // let result = stream.pipe(bucket.actions.openUploadStream(file.name));
    // console.log(result)
    // return result.id;
}
const saveFiles = async(files)=>{
    console.log("saving multiple files", {files})
    const promises = [];
    for (const file of files) {
        promises.push(saveFile(file));
        
    }
    const results = await Promise.all(promises);
    console.log({results});
    return results;
=======
    console.log(file.data);
    let stream = Readable.from(file.data);
    let result = stream.pipe(bucket.actions.openUploadStream(file.name));
    console.log(result.id)
    return result.id;
>>>>>>> 3e29272db5dfa97fde482d522db8857360648d00
}
const getFile = async(id)=>{
    let cursor; 
    if (id) cursor = bucket.actions.find({_id: new ObjectId(id)});
    else {
        cursor = bucket.actions.find({});
    }
    const values = await cursor.toArray();
    return values
}

const downloadFile = async(req, res) =>{
    console.log({params: req.params})
    let id = req.params.id;
    if (!ObjectId.isValid(id)) throw new AppError(1, 404, "invalid id");
    let stream = await bucket.actions.openDownloadStream(new ObjectId(id));
    stream.on("error",(err)=>{
        return res.send({err: err.message})
    })
    return stream.pipe(res);
}
const deleteFile = async(file) =>{
    if(file.public_id){
        await cloudinary.uploader.destroy(file.public_id);
    }else{
        console.log("no public id in deleting file...")
    }
    
    // if(!id) throw new AppError("invalid id")
    // if (!ObjectId.isValid(id)) throw new AppError(1, 404, "invalid id");
    // let stream;
    // try {
    //     stream = await bucket.actions.delete(new ObjectId(id));
    // } catch (err) {
    //     console.log({err})
    //     //throw new AppError(1, 404, err.message)
    // }
    
    // console.log(stream)
    // return stream;
}


module.exports = {
    saveFile,
    getFile,
    downloadFile,
    deleteFile
}
