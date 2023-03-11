import {PayPalButtons} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { baseUrl } from "../../App";
const PaypalForm = ({itemId, itemType, credentials, setMessage}) =>{

    const createOrder = async(data, actions)=>{
        console.log({credentials}, this)
        let url = baseUrl+"/create-paypal-order";
        const {id, link} = await fetch(url, {
            method: "POST",
            credentials: "include",
            //withCredentials: true,
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({itemId, itemType, ...credentials})
        }).then(res => res.json());
        //window.location.assign(link);
        if(!id) new Error('Cannot create order')
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
          });
    }
    const onError = (err) =>{
        console.log({err})
        setMessage({content: "An Error Occurred", type: "error"})
    }
    const onCancel =  (data)=>{
        console.log("order canceled", {data})
        setMessage({content: "Order Canceled", type: "error"})
    }
    return (<div id="paypal-button">
    <PayPalButtons
            forceReRender={[credentials]} 
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
        
    )
}
export default PaypalForm;