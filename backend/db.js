require("dotenv").config()
const mongoose = require("mongoose");

let bucket = {
    actions: null
}
const connectDB = (url) => {
    mongoose.set("strictQuery", false);
    mongoose.connection.on("open", ()=>{
        let db = mongoose.connections[0].db;
        bucket.actions = new mongoose.mongo.GridFSBucket(db);
    })
    return mongoose.connect(url);
}
module.exports = {
    connectDB,
    bucket
};