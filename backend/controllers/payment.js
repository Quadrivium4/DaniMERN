require("dotenv").config();
const { User, Course, Subcourse, PaypalOrder,Discount } = require("../models");
const { sendMail } = require("../utils");

const { register } = require("../utils/user");
const path = require("path");
const fs = require("fs");
const { createOrder, capturePayment, retrieveOrder, sendPayment } = require("../utils/paypal");
const {getStripeCustomer,  createStripeCustomer, confirmStripePayment, getStripePayment, createStripePayment, getPaymentMethod} = require("../utils/stripe");
const { isValidObjectId } = require("mongoose");
const {checkCoupon} = require("../utils/discounts");
const clientUrl = process.env.NODE_ENV === "production" ? process.env.ONLINE_CLIENT_URL : process.env.CLIENT_URL;
const baseUrl = process.env.NODE_ENV === "production" ? process.env.ONLINE_BASE_URL : process.env.BASE_URL;

const validateCredentials = async(req, res)=>{
    if(req.session.userEmail) return res.send({message: true})
    const {name, email, password} = req.body;
    await register(name, email, password);
    res.send({message: true})
}
const validateCoupon = async(req, res) =>{
    console.log("validating...", req.body);
    const {itemId, couponId} = req.body;
    const {coupon, item, total} = await checkCoupon(itemId, couponId);
    res.send({message: "Valid coupon: ",initial: item.price, coupon: coupon.amount, total});
}
const createPaypalOrder = async(req, res)=>{
    console.log("creating paypal order", req.body);

    const {itemId, itemType, email, name, password, couponId} = req.body;
    let item;
    if (itemType === "course") item = await Course.findById(itemId);
    else if (itemType === "subcourse") item = await Subcourse.findById(itemId);
    else {
        throw new AppError(1, 404, "No item with that id")
    }
    let paypalOrder;
    let price = item.price;
    if (couponId) {
        const { coupon, total } = await checkCoupon(itemId, couponId);
        console.log({total})
        price = total;
    }
    if(!req.session.userEmail){
        const hashedPassword = await register(name, email, password);
        paypalOrder = await PaypalOrder.create({
            customer: {
                name,
                email,
                password: hashedPassword
            },
            amount: price,
            itemId,
            itemType
        })
    }else{
        let user = await User.findOne({email: req.session.userEmail});
        if (user.courses.includes(itemId) || user.subcourses.includes(itemId)) throw new AppError(1, 400, "You already bought this course!");
        paypalOrder = await PaypalOrder.create({
            customer: {
                name: user.name,
                email: user.email,
                password: user.password
            },
            amount: price,
            itemId,
            itemType
        })
        
    }
    
    

    const { link, token, id } = await createOrder(price, item, paypalOrder._id);
    await PaypalOrder.findByIdAndUpdate(paypalOrder._id, {
        orderId: id
    })
    console.log({link, id, token}, paypalOrder)
    res.send({link, id, token})
}
const approvePaypalOrder = async(req, res) =>{
    console.log("approving paypal order", req.body);
    const { orderId } = req.body;
    let order = await retrieveOrder(orderId);
    console.log({order: order.purchase_units, first: order.purchase_units[0]})
    let paypalOrder = await PaypalOrder.findById(order.purchase_units[0].custom_id);
    console.log(paypalOrder)
    const result = await sendMail(`Confirm Paypal Payment: <a href="${baseUrl}/capture-paypal-order/${orderId}">confirm</a>`,paypalOrder.customer.email, "Confirm Payment" )
    res.send({message: "We sent you an email", mail: result});
}
const capturePaypalOrder = async (req, res) => {
    console.log("capturing paypal order", req.body);
    const {id} = req.params;
    const { purchase_units, payer } = await capturePayment(id);
    let unit = purchase_units[0];
    let {payments: {captures}} = unit;
    let purchase = captures[0];
    console.log(purchase);
    const {itemId, itemType,customer: {name, email, password}} = await PaypalOrder.findByIdAndDelete(purchase.custom_id);
    let item;
    let courses = [];
    let subcourses = []
    if (itemType === "course") {
        item = await Course.findById(itemId);
        courses.push(item.id)
    }
    else if (itemType === "subcourse") {
        item = await Subcourse.findById(itemId);
        subcourses.push(item.id);
    }
    else throw new AppError(1, 404, "No item found with that name")


    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            password,
            email,
            courses,
            subcourses,
            paypalId: payer.payer_id
        })

        req.session.userEmail = email;
    } else {
        if (itemType === "course") {
            courses = [...user.courses, itemId]
            user = await User.findByIdAndUpdate(user._id, {
                courses
            })
        } else {
            subcourses = [...user.subcourses, itemId];
            user = await User.findByIdAndUpdate(user._id, {
                subcourses
            })
        }
    }
    return res.redirect(clientUrl);
}

const createPaymentIntent = async(req, res) =>{
    console.log("create stripe payment", req.body);
    let { itemId, itemType, email, name, password, paymentMethodId, couponId } = req.body;
    
    let user;
    let customer;
    if (!req.session.userEmail) password = await register(name, email, password);
    else {
        user = await User.findOne({ email: req.session.userEmail });
        name = user.name;
        email = user.email;
        password = user.password;
        if(user.courses.includes(itemId) || user.subcourses.includes(itemId)) throw new AppError(1, 400, "You already bought this course!");
    }
    if (!user || !user.stripeId) customer = await createStripeCustomer(name, email, password);
    if(user && user.stripeId) customer = await getStripeCustomer(user.stripeId);

    let item;
    if (itemType === "course") item = await Course.findById(itemId);
    else if (itemType === "subcourse") item = await Subcourse.findById(itemId);
    else throw new AppError(1, 404, "No item with that id");
    
    let price = item.price;
    if (couponId) {
        const { coupon, total } = await checkCoupon(itemId, couponId);
        price = total;
    }
    // todo save payment method to customer
    const paymentMethod =  await getPaymentMethod(paymentMethodId);
    paymentMethod.customer = customer.id;
    console.log({paymentMethod});
    const paymentIntent = await createStripePayment(paymentMethodId, customer.id, price, itemId, itemType);
    sendMail(`Confirm Payment: <a href="${baseUrl}/confirm-payment-intent/${paymentIntent.id}">confirm</a>`, email, "Confirm Payment")
    return res.send({ message: "We sent you an email" });
}

const confirmPaymentIntent = async (req, res) =>{
    console.log("confirm stripe payment", req.params);
    const { id } = req.params;
    const paymentIntent = await getStripePayment(id);
    const { id: stripeId, email, name, metadata: {password, logged}} = await getStripeCustomer(paymentIntent.customer);
    if(!password) throw new AppError(1, 500, "Passoword: " + password)
    const {itemId, itemType} = paymentIntent.metadata;
    let item;
    let courses = [];
    let subcourses = []
    if (itemType === "course") {
        item = await Course.findById(itemId);
        courses.push(item.id)
    }
    else if (itemType === "subcourse") {
        item = await Subcourse.findById(itemId);
        subcourses.push(item.id);
    }
    else throw new AppError(1, 404, "No item found with that name")


    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            password,
            email,
            stripeId, 
            courses,
            subcourses
        })
        req.session.userEmail = email;
    } else {
        if (itemType === "course") {
            courses = [...user.courses, itemId]
            user = await User.findByIdAndUpdate(user.id, {
                courses
            })
        } else {
            subcourses = [...user.subcourses, itemId];
            user = await User.findByIdAndUpdate(user.id, {
                subcourses
            })
        }
    }

    
    const confirmedPayment = await confirmStripePayment(id);
    console.log("confirmedpayment", confirmedPayment);
    console.log("redirecting...", clientUrl)
    return res.redirect(clientUrl);
}

const pay = async (req, res)=>{
    const user = req.user;
    console.log("hello world", user.paypalId)
    sendPayment(user.paypalId, 100)
}
module.exports = {
    validateCredentials,
    validateCoupon,
    createPaymentIntent,
    confirmPaymentIntent,
    capturePaypalOrder,
    approvePaypalOrder,
    createPaypalOrder,
    pay
}