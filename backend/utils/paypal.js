
// For a fully working example, please see:
// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration
require("dotenv").config();
const urlModule = require("url");
const baseURL = process.env.NODE_ENV === "production" ?
    "https://api-m.paypal.com" :
    "https://api-m.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

async function createOrder(total, item, custom_id) {
        const accessToken = await generateAccessToken();
        const url = `${baseURL}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "eur",
                            value: total/100,
                            breakdown: {
                                item_total:{
                                    currency_code: "eur",
                                    value: item.price/100
                                },
                                discount: {
                                    currency_code: "eur",
                                    value:(item.price-total)/100
                                }
                            }
                        },
                        custom_id
                    },
                ],
            }),
        });
        const data = await response.json();
        let link;
        let id = data.id;
        for(let i in data.links){
            if(data.links[i].rel === "approve"){
                link = data.links[i].href;
                break;
            }
        }
        console.log({data, link, details: data.details})
        let {token} = urlModule.parse(link, true).query
        return { link, token, id};
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}
async function retrieveOrder(orderId){
    const accessToken = await generateAccessToken();
    const url = `${baseURL}/v2/checkout/orders/${orderId}`;
    console.log({url})
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}
// generate an access token using client id and app secret
async function generateAccessToken() {
    //console.log(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    console.log(fetch);
    //console.log(auth)
    const response = await fetch(`${baseURL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    console.log(response)
    const data = await response.json();
    console.log({data})
    return data.access_token;
}
const sendPayment = async(paypalId, amountInEur)=>{
    console.log("sending payment...", paypalId, amountInEur)
    const accessToken = await generateAccessToken();
    console.log(`Bearer ${accessToken}`)
    const url = `${baseURL}/v1/payments/payouts`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            items: [
                {
                    receiver: paypalId,
                    amount: {
                        currency: "EUR",
                        value: amountInEur
                    },
                    recipient_type: "PAYPAL_ID",
                    note: "Thanks for your patronage!",
                }
            ],
            sender_batch_header: {
                //sender_batch_id: "Payouts_2020_100007",
                email_subject: "You have a payout!",
                email_message: "You have received a payout! Thanks for using our service!"
            }
        })
    })
    const data = await response.json();
    console.log({data})
}
module.exports = {
    capturePayment,
    retrieveOrder,
    createOrder,
    sendPayment
}