const express = require("express");
const app = express();
const errorHandler = (err, req, res, next) =>{
    console.log(err)
    return res.status(400).send(err.message);
}

let getUser = () => undefined;

const tryCatch = (controller) => async(req, res, next) =>{
    try {
        await controller(req, res)
    } catch (error) {
        return next(error)
    }
}

getUser = undefined

app.get("/", tryCatch(async(req, res)=>{
        const user = getUser();
        if (!user) {
            return next(new Error("user not found"));
        }
        const name = user.name;
        return res.send("hi");
    })
)
console.log(console)
app.use(errorHandler)
app.listen(1234, ()=>{
    console.log('\x1b[4m\x1b[100m Welcome to the app! \x1b[0m');
    console.log("Server listening on port 1234")
})