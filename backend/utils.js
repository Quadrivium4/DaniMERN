require("dotenv").config();
var nodemailer = require('nodemailer');
const {google} = require("googleapis");
const axios = require("axios");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);
const { User, Course} = require("./models");


const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID, 
    process.env.GMAIL_CLIENT_SECRET,
    process.env.REDIRECT_URI
    );
oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
})


const sendMail = async(body, to, subject) =>{
    
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: process.env.MY_EMAIL,
            pass: process.env.PASSWORD_GMAIL,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    

    var mailOptions = {
        from: process.env.MY_EMAIL,
        to:to,
        subject: subject,
        html: body
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
}
const validateEmail = (email) => {
    const expression = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/i;
    return expression.test(String(email).toLowerCase());
}
const verifyLogin = (req, res, next) =>{
    if(req.session.userEmail == undefined){
        console.log("user not allowed")
        return res.send({
            ok: false,
            message: "You are not allowed!",

        })
    }else{
        next();
    }
}
async function requestCourseData(token, projectId) {
    const response = await axios.get(`https://api.wistia.com/v1/projects/${projectId}.json`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
}
const purchase = async (req, res) => {
    const email = req.session.userEmail;
    if (email != undefined) {
        const { itemId, stripeTokenId } = req.body;
        const course = await Course.findById(itemId);
        const user = await User.findOne({
            email: email
        })

        stripe.charges.create({
            amount: course.price,
            source: stripeTokenId,
            currency: "usd"
        }).then(async () => {
            console.log("Charge Successful", user.courses);
            const userCourses = user.courses;
            userCourses.push(itemId);
            console.log(userCourses)
            const newUser = await User.findOneAndUpdate({
                email: email
            }, {
                courses: userCourses
            }, {
                new: true
            })
            console.log(newUser);
            res.json({
                message: "Successful purhcased"
            })
        }).catch((err) => {
            console.log(err)
            res.status(500).end()
        })
    } else {
        res.send({
            ok: false,
            message: "You should login first",

        })
    }
}

module.exports = {
    validateEmail,
    sendMail,
    verifyLogin,
    requestCourseData,
    purchase
}