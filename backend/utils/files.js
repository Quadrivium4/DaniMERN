require("dotenv").config()
const {bucket} = require("../db");
const {Readable} = require("stream");
const { ObjectId } = require("mongodb");
const saveFile = async(file)=>{
    let stream = Readable.from(file.data);
    let result = stream.pipe(bucket.actions.openUploadStream(file.name));
    console.log(result.id)
    return result.id;
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
const deleteFile = async(id) =>{
    if(!id) throw new AppError("invalid id")
    if (!ObjectId.isValid(id)) throw new AppError(1, 404, "invalid id");
    let stream;
    try {
        stream = await bucket.actions.delete(new ObjectId(id));
    } catch (err) {
        console.log({err})
        //throw new AppError(1, 404, err.message)
    }
    console.log(stream)
    return stream;
}


module.exports = {
    saveFile,
    getFile,
    downloadFile,
    deleteFile
}