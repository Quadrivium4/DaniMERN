require("dotenv").config();
require("./globals")
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const crypto  = require("crypto");
const fileUpload = require("express-fileupload");

const app = express();
const port = 1234;
const {connectDB} = require("./db")
const {publicRouter, protectedRouter} = require("./routes");
const errorHandler = require("./middlewares/errorHandler");



app.use(bodyParser.json({
    verify: function (req, res, buf, encoding) {

        // sha1 content
        var hash = crypto.createHash('sha1');
        hash.update(buf);
        req.hasha = hash.digest('hex');

        // get rawBody        
        req.rawBody = buf.toString();


    }
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:8080", "https://dani-courses-client.onrender.com"],
    methods: ["POST", "PUT", "GET","DELETE", "OPTIONS", "HEAD"],
    credentials: true
}))
app.use("/assets", express.static("./public"))
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production"? "none": "lax"
    },
    
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "Store"
    })
}))
app.use("/protected", protectedRouter);
app.use(publicRouter);

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
app.use(errorHandler)
app.use("/protected", errorHandler)
main();
