
// For a fully working example, please see:
// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration
require("dotenv").config();
const urlModule = require("url");
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

async function createOrder(item, custom_id) {
        const accessToken = await generateAccessToken();
        const url = `${baseURL.sandbox}/v2/checkout/orders`;
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
                            value: item.price/100,
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
        //console.log(data, link)
        let {token} = urlModule.parse(link, true).query
        return { link, token, id};
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
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
    const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}`;
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
    //console.log(auth)
    const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    //console.log(response)
    const data = await response.json();
    //console.log({data})
    return data.access_token;
}

module.exports = {
    capturePayment,
    retrieveOrder,
    createOrder
}