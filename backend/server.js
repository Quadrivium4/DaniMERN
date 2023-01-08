require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const port = 5000;
const connectDB = require("./db")
const {router} = require("./routes");



app.use(session({
    secret: process.env.SECRET,
    cookie: {
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "Store"
    })
}))
app.use(router)


const main = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })
    } catch (err) {
        console.log(err);
    }
}
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
main();
