import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";
import {
PaymentElement,
CardElement,
CardNumberElement,
useStripe,
useElements
} from "@stripe/react-stripe-js";
import { baseUrl } from "../../App";
import { useUser } from "../../Context";
import Message from "../../components/Message";
import { crossing } from "../../utils";



const appearance = {
    style: {
      base: {
        color: "white",
        fontFamily: 'sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "20px",
        padding: "10px",
        "::placeholder": {
          color: "rgb(200,200,200)"
        },
        backgroundColor: "transparent"
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

export default function CheckoutForm({itemId, itemType, credentials, couponId}) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    console.log("creating card")
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;


        setIsLoading(true);
        let {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });
        let {errorCard, card} = await stripe.createToken()
        if(error){
            setIsLoading(false);
            return setMessage({type: "error", content: error.message})
        }

        fetch(baseUrl + "/create-payment-intent", {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({itemId, itemType, email: credentials.email, paymentMethodId: paymentMethod.id, name: credentials.name,password: credentials.password, couponId})
        } ).then(async(res)=>{
            if(res.ok){
                return res.json();
            }
            const response = await res.json();
            throw new Error(response.message);
        }).then(async(res)=>{
            setMessage({type: "success", content: res.message})
            console.log(res);
        }).catch(err=>{
            setMessage({type: "error", content: err.message})
        })

        setIsLoading(false);
    }

    return (
        <form id="stripe-form" onSubmit={handleSubmit}>
            <div id="card-element" >
                {<CardElement id="payment-element" options={appearance} />}
            </div>
        
        <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
            {isLoading ? "Loading..." : "Pay now"}
            </span>
        </button>
        {/* Show any error or success messages */}
        {message? <Message type={message.type}  content={message.content} toggle={()=>{setMessage(false)}}></Message>: null}
        </form>
    );
}