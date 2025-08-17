import {PayPalButtons} from "@paypal/react-paypal-js";
import { useState } from "react";
import { baseUrl } from "../../App";
import Message from "../../components/Message";
const PaypalForm = ({itemId, itemType, credentials, couponId}) =>{
    console.log("on paypal", {couponId})
    const [message, setMessage] = useState();
    const createOrder = async(data, actions)=>{
        console.log({credentials}, this)
        let url = baseUrl+"/create-paypal-order";
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            //withCredentials: true,
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({itemId, itemType, couponId, ...credentials})
        }).then(res => res.json()).catch(err=>{
            console.log("hi jfkdlsa;fjkdslf;dsjfklds;")
            setMessage({content: err.message, type: "error"})
        })
        //window.location.assign(link);
        console.log(res)
        const {id, link} = res;
        if(!id) throw new Error(res.message)
        return id
    }
    const onApprove = async(data, actions) =>{
        console.log("order approved", data)
        let url = baseUrl+ "/approve-paypal-order";
        await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: data.orderID,
            })
          })
          .then((response) => response.json())
          .then((data) => {
                setMessage({content: data.message, type: "success"})
          }).catch(err=>{
            setMessage({content: err.message, type: "error"})
          })
    }
    const onError = (err) =>{
        console.log({err})
        setMessage({content:err.message, type: "error"})
    }
    const onCancel =  (data)=>{
        console.log("order canceled", {data})
        setMessage({content: "Order Canceled", type: "error"})
    }
    return (
        <>
    <div id="paypal-button">
    <PayPalButtons
            forceReRender={[credentials,couponId]} 
            style={{
                layout: "horizontal",
                color: "gold",
            }}
            onInit={(data, actions)=>{
                console.log("init")
            }}
            
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            ></PayPalButtons>
    </div>
    {message? <Message type={message.type} content={message.content} toggle={()=>{setMessage(null)}}></Message>: null}
        </>
    )
}
export default PaypalForm;