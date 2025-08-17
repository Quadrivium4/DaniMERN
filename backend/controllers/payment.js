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
    const {isAffiliateCoupon, item, total} = await checkCoupon(itemId, couponId);
    if(isAffiliateCoupon){
        return res.send({ message: "Valid coupon: ", initial: item.price, coupon: 10, total });
    }
    res.send({message: "Valid coupon: ",initial: item.price, coupon: coupon.amount, total});
}
const createPaypalOrder = async(req, res)=>{
    console.log("creating paypal order", req.body);

    const {itemId, itemType, email, name, password, couponId} = req.body;
    let item;
    let receiver;
    if (itemType === "course") item = await Course.findById(itemId);
    else if (itemType === "subcourse") item = await Subcourse.findById(itemId);
    else {
        throw new AppError(1, 404, "No item with that id")
    }
    let paypalOrder;
    let price = item.price;
    if (couponId) {
        const {total, isAffiliateCoupon} = await checkCoupon(itemId, couponId);
        console.log({total, isAffiliateCoupon})
        if(isAffiliateCoupon) receiver = await User.findById(couponId);
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
            hasCoupon: receiver && receiver.paypalId ? true : false,
            coupon: { 
                amountInEur: (item.price / 100 * 10 /* <--- percentage */) / 100 /* to EUR (paypal required)*/,
                receiver: receiver.paypalId
            },
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
            hasAffiliateCoupon: receiver ? true : false,
            affiliateCoupon: {
                amountInEur: (item.price / 100 * 10 /* <--- percentage */)  /100 /* to EUR (paypal required)*/ ,
                receiver: receiver?.paypalId
            },
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
    console.log({paypalOrder})
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
    const {itemId, itemType,customer: {name, email, password}, hasAffiliateCoupon, affiliateCoupon} = await PaypalOrder.findByIdAndDelete(purchase.custom_id);
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
    if(hasAffiliateCoupon){
        let sentPayment = await sendPayment(affiliateCoupon.receiver, affiliateCoupon.amountInEur);
    }
    return res.redirect(clientUrl);
}

const createPaymentIntent = async(req, res) =>{
    console.log("create stripe payment", req.body);
    let { itemId, itemType, email, name, password, paymentMethodId, couponId } = req.body;
    
    let user;
    let customer;
    let receiver; 

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
        const { total, isAffiliateCoupon } = await checkCoupon(itemId, couponId);
        console.log({total, isAffiliateCoupon});
        if (isAffiliateCoupon) receiver = await User.findById(couponId);
        console.log({ total })
        price = total;
    }
    // todo save payment method to customer
    const paymentMethod =  await getPaymentMethod(paymentMethodId);
    paymentMethod.customer = customer.id;
    console.log({paymentMethod, receiver});
    const paymentIntent = await createStripePayment(paymentMethodId, customer.id, price, itemId, itemType, receiver?.paypalId);
    sendMail(`Confirm Payment: <a href="${baseUrl}/confirm-payment-intent/${paymentIntent.id}">confirm</a>`, email, "Confirm Payment")
    return res.send({ message: "We sent you an email" });
}

const confirmPaymentIntent = async (req, res) =>{
    console.log("confirm stripe payment", req.params);
    const { id } = req.params;
    const paymentIntent = await getStripePayment(id);
    const { id: stripeId, email, name, metadata: {password, logged}} = await getStripeCustomer(paymentIntent.customer);
    if(!password) throw new AppError(1, 500, "Passoword: " + password)
    const {itemId, itemType, receiver} = paymentIntent.metadata;
    console.log(paymentIntent.metadata)
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
    console.log("should i pay receiver? ", {receiver})
    if(receiver){
        console.log("yes pay him! ")
        let sentPayment = await sendPayment(receiver, (item.price / 100 * 10 /* <--- percentage */) / 100 /* to EUR (paypal required)*/,)
    }
    
    const confirmedPayment = await confirmStripePayment(id);
    console.log("confirmedpayment", confirmedPayment);
    console.log("redirecting...", clientUrl);
    return res.redirect(clientUrl);
}

module.exports = {
    validateCredentials,
    validateCoupon,
    createPaymentIntent,
    confirmPaymentIntent,
    capturePaypalOrder,
    approvePaypalOrder,
    createPaypalOrder
}