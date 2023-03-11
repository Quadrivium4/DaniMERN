require("dotenv").config();
var nodemailer = require('nodemailer');
const {google} = require("googleapis");
const axios = require("axios");
const path = require("path");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const FormData = require("form-data");
const stripe = require("stripe")(stripeSecretKey);
const { User, Course} = require("./models");
const fs = require("fs")
const fsPromises = require("fs/promises");
const PDFDocument = require('pdfkit');


const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID, 
    process.env.GMAIL_CLIENT_SECRET,
    process.env.REDIRECT_URI
    );
oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
})
const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        console.log("error")
        return next(error)
    }
}
const getNewFileName = (fileName) =>{
    const newFileName = Date.now() + "_" + (Math.floor(Math.random() * (9999 - 1000)) + 1000) + "_" + fileName.replace(/\s/g, "");
    return newFileName;
}
const deleteFile = (filePath) =>{
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err)
        }
    })
}

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

async function uploadWistiaVideo(video){
    console.log(video.data)
    const form = new FormData();
    form.append("file", video.data, video.name);
    form.append("project_id", "s7znozbr2e")
    const response = await axios.post(`https://upload.wistia.com`,form,{
        headers: {
            'Authorization': `Bearer ${process.env.WISTIA_TOKEN}`,
            ...form.getHeaders(),
        },

    });
    if(!response) return null;
    return response.data;
}
async function deleteWistiaVideo(id) {
    const response = await axios.delete(`https://api.wistia.com/v1/medias/${id}.json` , {
        headers: {
            'Authorization': `Bearer ${process.env.WISTIA_TOKEN}`,
        },

    });
    if (!response) return null;
    return response.data;
}
async function requestCourseData(projectId) {
    const response = await axios.get(`https://api.wistia.com/v1/projects/${projectId}.json`, {
        headers: {
            'Authorization': `Bearer ${process.env.WISTIA_TOKEN}`,
            
        }
    });
    return response.data;
}

async function getWistiaVideos(projectIds){
    return Promise.all(projectIds.map(id => requestCourseData(id)))
    
}
async function testSpeed(name, fn) {
    let start, end;
    start = Date.now();
    let result = await fn();
    end = Date.now();
    console.log(`${name} process ended:  ${(end - start) / 1000}s`)
}
async function download(fileSrc){
    const res = await axios({
        url: fileSrc,
        responseType: "arraybuffer"
    })
    return res.data
}
async function saveFile(file, savePath){
    console.log("My new save file function", file, savePath)
    const fileName = getNewFileName(file.name);
    const filePath = path.join(savePath, fileName);
    await fsPromises.writeFile(filePath, file.data);
    return fileName;

}
function createPdfReview(pathName, title, username, img, fields, priceRange, comment) {
    const colors = {
        dark: "#000014",
        medium: "#0F1437",
        light: "#233264"
    }
    const doc = new PDFDocument;
    let curPosY = 0;
    doc.pipe(fs.createWriteStream(`${pathName}.pdf`));

    // BACKGROUND
    let grad = doc.linearGradient(0, 0, 0, doc.page.height)
    grad.stop(0, colors.dark).stop(0, colors.light);
    doc
        .rect(0, 0, doc.page.width, doc.page.height)
        .fill(grad);

    // TITLE
    doc
        .fillColor("white")
        .font("./public/fonts/impact.ttf")
        .fontSize(40)
        .text('SCHEDA DI VALUTAZIONE', 0, curPosY += 20, {
            width: doc.page.width,
            align: "center"
        });
    curPosY += 40
    // HEADER 
    const HEADER_X = 25;
    const HEADER_Y = curPosY += 20;
    const HEADER_HEIGHT = 120;
    curPosY += 120;
    const HEADER_WIDTH = doc.page.width - HEADER_X * 2;
    console.log("header width", HEADER_WIDTH)
    doc
        .fillColor(colors.dark)
        .rect(HEADER_X, HEADER_Y, HEADER_WIDTH, HEADER_HEIGHT)
        .fill()
        .image(img, HEADER_X, HEADER_Y, {
            fit: [HEADER_WIDTH / 2.5 - 5, HEADER_HEIGHT],
            valign: "center",
            align: "center",
        })
        .fillColor("white")
        .fontSize(18)
        .font("./public/fonts/tahoma.ttf")
        .text(`Titolo: "${title}"`, HEADER_WIDTH / 2.5 + HEADER_X + 15, HEADER_Y + 20, {

        })
        .moveDown(0.25)
        .text(`Filmmaker:  ${username}`, {

        })
    const rangeDiffMax = 2000 / 10 - priceRange.max / 10;
    const rangeDiffMin = 2000 / 10 - priceRange.min / 10;
    const valore = ["V", "A", "L", "O", "R", "E"];
    doc
        .fillColor("white")
        .fontSize(22)
    valore.forEach((char, i) => {
        doc.text(char, doc.page.width - 64, curPosY + 30 * i + 30)
    })
    doc
        .fillColor(colors.dark)
        .rect(doc.page.width - 115, curPosY + 18, 40, 2000 / 10)
        .fillAndStroke()
        .fillColor('white')
        .fontSize(15)
        .text("€" + priceRange.max, doc.page.width - 165, curPosY + 9 + rangeDiffMax)
        .fillColor(colors.medium)
        .rect(doc.page.width - 115, curPosY + 18 + rangeDiffMax, 40, 2000 / 10 - rangeDiffMax)
        .fillAndStroke()
        .fillColor('white')
        .fontSize(15)
        .text("€" + priceRange.min, doc.page.width - 165, curPosY + 9 + rangeDiffMin)
        .fillColor(colors.light)
        .rect(doc.page.width - 115, curPosY + 18 + rangeDiffMin, 40, 2000 / 10 - rangeDiffMin)
        .fillAndStroke()

    fields.forEach((field, i) => {
        const y = curPosY += 24;
        doc
            .fillColor("#EEEEEE")
            .fontSize(18)
            .text(field.name, 220 - doc.widthOfString(field.name), y)
        if (field.rate != 0) {
            doc
                .fillColor(colors.light)
                .rect(230, y, field.rate * 36, 20)
                .fillAndStroke()
        }



    })
    //console.log(doc.page.width
    const commentHeight = doc.page.height - (curPosY + 10);
    const textareaHeight = doc.page.height - (curPosY + 50);
    const textareaWidth = doc.page.width - 40;
    doc
        .fillColor(colors.dark)
        .rect(20, curPosY += 40, textareaWidth, textareaHeight)
        .fill()
        .fillColor("white")
        .fontSize(19)
        .text("SUGGERIMENTI | OSSERVAZIONI", 0, curPosY += 15, {
            width: doc.page.width,
            align: "center"
        })
        .moveTo(20 + 60, curPosY += 28)
        .lineTo(doc.page.width - 20 - 60, curPosY)
        .stroke("#AAAAAA")
        .fontSize(16)
        .fillColor("#EEEEEE")
        .text(comment, 40, curPosY += 20, {
            height: commentHeight,
            width: textareaWidth - 30
        })

        .image(
            "./public/images/logo.png"

            , doc.page.width - 130, doc.page.height - 130, {
            width: 110,
        })
    doc.end()
}



module.exports = {
    validateEmail,
    sendMail,
    requestCourseData,
    getWistiaVideos,
    getNewFileName,
    deleteFile,
    uploadWistiaVideo,
    tryCatch,
    download,
    createPdfReview,
    deleteWistiaVideo,
    testSpeed,
    saveFile
}