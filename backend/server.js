require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");

const app = express();
const port = 5000;
const connectDB = require("./db")
const {router} = require("./routes");


app.use(cors({
    origin: ["http://localhost:3000", "https://dani-courses-client.onrender.com"]
}))
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
