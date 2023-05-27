require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const createStripeCustomer = async(name, email, password) => {
    const customer = await stripe.customers.create({
        name,
        email,
        metadata: {
            password: password,
            logged: false
        }
    })
    return customer;
}
const getPaymentMethod = async(paymentMethodId)=>{
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
}
const getStripeCustomer = async(stripeId) =>{
    const customer = await stripe.customers.retrieve(stripeId);
    return customer;
}
const deleteStripeCustomer = async(stripeId) =>{
    const customer = await stripe.customers.del(stripeId);
    return customer;
}
const createStripePayment = async(paymentMethodId, customerId ,itemPrice,itemId, itemType) =>{
    const payment = await stripe.paymentIntents.create({
        amount: itemPrice,
        currency: "eur",
        customer: customerId,
        payment_method: paymentMethodId,
        metadata: {
            itemId,
            itemType
        }
    });
    return payment
}
const confirmStripePayment = async(paymentId)=>{
    let confirmedPayment;
    try {
        confirmedPayment = await stripe.paymentIntents.confirm(paymentId);
    } catch (error) {
        throw new AppError(1, 400, "invalid link");
    }
    
    return confirmedPayment;
}
const getStripePayment = async(intentId)=>{
    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
    return paymentIntent;
}
const createPayout = async()=>{
    const payout = await stripe.payouts.create({
        amount: 5000,
        currency: "eur"
    })
    return payout;
}
module.exports ={
    createStripeCustomer,
    getStripeCustomer,
    confirmStripePayment,
    createStripePayment,
    deleteStripeCustomer,
    getStripePayment,
    getPaymentMethod,
    createPayout
}