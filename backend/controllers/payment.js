require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { User, Course, Subcourse, PaypalOrder } = require("../models");
const { sendMail } = require("../utils");
const { register } = require("../utils/user");
const path = require("path");
const fs = require("fs");
const { createOrder, capturePayment, retrieveOrder } = require("../utils/paypal");

stripe.customers.list({
    limit: 20
}).then(customers=>{
    //console.log(customers)
    /*customers.data.forEach((customer) => {
        stripe.customers.del(customer.id);
    })*/
})
const validateCredentials = async(req, res)=>{
    if(req.session.userEmail) return res.send({message: true})
    console.log(req.body)
    const {name, email, password} = req.body;
    await register(name, email, password);
    res.send({message: true})
}
const createPaypalOrder = async(req, res)=>{
    console.log("creating paypal order", req.body);

    const {itemId, itemType, email, name, password} = req.body;
    let item;
    if (itemType === "course") item = await Course.findById(itemId);
    else if (itemType === "subcourse") item = await Subcourse.findById(itemId);
    else {
        throw new AppError(1, 404, "No item with that id")
    }
    let paypalOrder;
    if(!req.session.userEmail){
        const hashedPassword = await register(name, email, password);
        paypalOrder = await PaypalOrder.create({
            customer: {
                name,
                email,
                password: hashedPassword
            },
            amount: item.price,
            itemId,
            itemType
        })
    }else{
        const user = await User.findOne({email: req.session.userEmail});
        paypalOrder = await PaypalOrder.create({
            customer: {
                name: user.name,
                email: user.email,
                password: user.password
            },
            amount: item.price,
            itemId,
            itemType
        })
    }
    
    

    const { link, token, id } = await createOrder(item, paypalOrder._id);
    await PaypalOrder.findByIdAndUpdate(paypalOrder._id, {
        orderId: id
    })
    console.log({link, id, token}, paypalOrder)
    res.send({link, id, token})
}
const approvePaypalOrder = async(req, res) =>{
    const { orderId } = req.body;
    let order = await retrieveOrder(orderId);
    console.log({order: order.purchase_units, first: order.purchase_units[0]})
    let paypalOrder = await PaypalOrder.findById(order.purchase_units[0].custom_id);
    console.log(paypalOrder)
    const result = await sendMail(`Confirm Paypal Payment: <a href="http://localhost:1234/capture-paypal-order/${orderId}">confirm</a>`,paypalOrder.customer.email, "Confirm Payment" )
    res.send({message: "We sent you an email", mail: result});
}
const capturePaypalOrder = async (req, res) => {
    const {id} = req.params;
    const { purchase_units } = await capturePayment(id);
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
            subcourses
        })
        const dirPath = path.join(__dirname, "../public/users/" + user._id);
        console.log(dirPath)
        fs.mkdir(dirPath, (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ error: err });
            }
            console.log("Directory Created!")

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
    return res.redirect("http://localhost:3000");
}

const createPaymentIntent = async(req, res) =>{
    console.log(req.body);
    const { itemId, itemType, email, name, password, paymentMethodId } = req.body;
    let item;
    if (itemType == "course") {
        item = await Course.findById(itemId);
    } else if (itemType == "subcourse") {
        item = await Subcourse.findById(itemId);
    }
    if(!req.session.userEmail){
        const hashedPassword = await register(name, email, password);
        console.log(hashedPassword)
        if (!hashedPassword) throw new AppError(1, 500, "hashedPassword: " + hashedPassword)
        
        const customer = await stripe.customers.create({
            name,
            email,
            metadata: {
                password: hashedPassword,
                logged: false
            },
            
        })
        console.log(item)
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        console.log({paymentMethod})
        const paymentIntent = await stripe.paymentIntents.create({
            amount: item.price,
            currency: "eur",
            customer: customer.id,
            payment_method: paymentMethodId,
            metadata: {
                itemId,
                itemType
            }
        });

        sendMail(`Confirm Payment: <a href="http://localhost:1234/confirm-payment-intent?paymentIntentId=${paymentIntent.id}">confirm</a>`, email, "Confirm Payment")
        return res.send({ message: "We sent you an email" });
    } else{
        console.log(req.session.userEmail)
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        console.log({ paymentMethod })
        let user = await User.findOne({email: req.session.userEmail});
        let customer;
        if(user.stripeId){
            console.log(user.stripeId)
            customer = await stripe.customers.update(user.stripeId, {
                metadata: {
                    password: user.password,
                    logged: true
                }
            });
        }else{
            customer = await stripe.customers.create({
                name: user.name,
                email: user.email,
                metadata: {
                    password: user.password,
                    logged: true
                }
            })
            user = await User.findByIdAndUpdate(user._id, {stripeId: customer.id}, {new: true})
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: item.price,
            currency: "eur",
            customer: customer.id,
            payment_method: paymentMethodId,
            metadata: {
                itemId,
                itemType
            }
        });

        sendMail(`Confirm Payment: <a href="http://localhost:1234/confirm-payment-intent/${paymentIntent.id}">confirm</a>`, user.email, "Confirm Payment")
        return res.send({ message: "We sent you an email" });
    }
    
}

const confirmPaymentIntent = async (req, res) =>{
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    const { id: stripeId, email, name, metadata: {password, logged}} = await stripe.customers.retrieve(paymentIntent.customer);
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
        const dirPath = path.join(__dirname, "../public/users/" + user._id);
        console.log(dirPath)
        fs.mkdir(dirPath, (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ error: err });
            }
            console.log("Directory Created!")

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

    
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id);
    console.log("confirmedpayment", confirmedPayment);
    return res.redirect("http://localhost:3000");
}
const stripeEvents = async(req, res) =>{
    console.log("stripe session", req.session)
    if(process.env.STRIPE_WEBHOOK_SECRET){
        let signature = req.headers["stripe-signature"];
        let event = stripe.webhooks.constructEvent(req.rawBody,signature, process.env.STRIPE_WEBHOOK_SECRET )
        console.log({event: event.type});
        if (event.type === "payment_intent.succeeded"){
            
            const paymentObject = event.data.object;
            console.log(paymentObject)
        }
            /*const email = paymentObject.metadata.userEmail;
            const itemId = paymentObject.metadata.itemId;
            const itemType = paymentObject.metadata.itemType;
            const user = await User.findOne({
                email: email
            })
            console.log("user",user);
            console.log("itemType",itemType);
            let userItems = user[itemType + "s"];
        
            userItems.push(itemId);
            console.log(userItems);
            const obj = {
                [itemType]: userItems
            }
            console.log(obj)
            const newUser = await User.findOneAndUpdate({
                email: email
            }, {
                [itemType +"s"]: userItems
            }, {
                new: true
            })
            console.log(newUser);
        }*/
    }
    
    res.sendStatus(200)
}

module.exports = {
    validateCredentials,
    createPaymentIntent,
    confirmPaymentIntent,
    capturePaypalOrder,
    approvePaypalOrder,
    createPaypalOrder,
    stripeEvents
}