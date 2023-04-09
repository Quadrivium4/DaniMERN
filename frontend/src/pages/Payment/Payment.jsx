import { useEffect, useState } from "react";
import { useLocation, useNavigate, redirect} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import StripeForm from "./StripeForm";
import PaypalForm from "./PaypalForm";
import { baseUrl } from "../../App";
import { useUser, useUserDispatch } from "../../Context";
import Message from "../../components/Message";
import Pop from "../../components/Pop";
import Login from "../../components/Login";
import { getFile, logout } from "../../controllers";
import { PayPalScriptProvider} from "@paypal/react-paypal-js";
import "./Payment.css"
import creditCards from "../../assets/icons/credit-cards.png";
import paypalLogo from "../../assets/icons/paypal-logo.png";
import PaymentOption from "./components/PaymentOption";
const PUBLIC_KEY = "pk_test_51MKGlKC6B9y91JPQ5ZiXoWTOzDT36UPJicGYV1V7pg1HnjRZ28jZMywuzxcVOLrnriuWrEmyGq0YHFVAwvne7MBy00X45DXHLQ";
const stripePromise = loadStripe(PUBLIC_KEY);



function Payment(){
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state;
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password:  ""
    })
    const [message, setMessage] = useState()
    const {isLogged, info, loading} = useUser();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dispatch = useUserDispatch();
    const [paymentType, setPaymentType] = useState();
    const [loginPop, setLoginPop] = useState(false);
    const [couponCode, setCouponCode] = useState(false)
    const validateCredentials = async()=>{
        console.log({credentials})
        let result = await fetch(baseUrl + "/validate-credentials", {
            method: "POST",
            credentials: "include",
            withCredentials: true,
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        if(result.ok) return false;
        return await result.json()
    }
    return (
        <div id="checkout" className="page">
            {loginPop? <Pop toggle={()=>setLoginPop(false)} >
                <Login toggle={()=>setLoginPop(false)}></Login>
            </Pop>: null}
            <section className="course-info">
                <h1>Il corso</h1>
                {item? 
                <>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <img src={getFile(item.coverImg)} alt={item.description}></img>
                    <h2>€{(item.price/100).toFixed(2)}</h2>
                    {item.subcourses? <div>
                        <h3>Subcourses:</h3>
                        {item.subcourses.map(subcourse=>{
                            return (
                                <div className="subcourse" key={subcourse.id}>
                                    <h4>{subcourse.name}</h4>
                                    <p>{subcourse.description}</p>
                                    <p>Duration: {subcourse.duration}</p>
                                </div>
                            )
                        })}
                    </div>: null}
                </>
                    
            : <p>loading</p>}
            </section>
            <section className="data">
                
            {
                !isLogged && !loading? 
                <>
                        <h1>Registrati</h1>
                        <p>Already have an account? <button onClick={()=>setLoginPop(true)}>Login</button></p>
                        <div className="form">
                            <h3>Name:</h3>
                            <input name="name" onChange={(e)=> setCredentials({...credentials, name: e.target.value})} value={credentials.name}  onFocus={()=>setMessage(false)} disabled={isSubmitted} required></input>
                            <h3>Email:</h3>
                            <input name="email" type="email" onChange={(e)=>setCredentials({...credentials, email: e.target.value})} value={credentials.email}  onFocus={()=>setMessage(false)} disabled={isSubmitted}  required ></input>
                            <h3>Password:</h3>
                            <input name="password" onChange={(e)=>setCredentials({...credentials, password: e.target.value})} value={credentials.password} onFocus={()=>setMessage(false)} disabled={isSubmitted} required />
                            {/*Boolean(paymentType)? <button onClick={()=>setPaymentType(false)}>change</button>: null*/}
                            {isSubmitted? <button onClick={()=>setIsSubmitted(false)}>Change</button>: 
                            <button onClick={async()=>{
                                let err = await validateCredentials();
                                console.log(err)
                                if(err) return setMessage({content: err.message, type: "error"});
                                setIsSubmitted(true);
                            }}>Submit</button>}
                        </div>
                    </>: isLogged?
                <>
                    <h1>info</h1>
                    <div className="form">
                        <h3>Name:</h3>
                        <input type="text" value={info.name} disabled/>
                        <h3>Email:</h3>
                        <input type="text" value={info.email} disabled/>
                        <button onClick={async()=>{
                            let data = await logout();
                            console.log("logout data",data)
                            if(data.ok){
                                console.log("redirecting")
                                redirect("/")
                                dispatch({type: "RESET", value: null});
                            }else{
                                console.log(data.message)
                            }
                            }}>log out</button>
                    </div>
                </> : <p>loading</p>
                
            }
            {message? <Message type={message.type} content={message.content} toggle={()=>setMessage(false)}></Message>: null}
            </section>
            <section className="payment">
                <h1>Pagamento</h1>
                <div className="payment-options">
                    <PaymentOption 
                        img={creditCards} 
                        setPaymentType={setPaymentType} 
                        currentPaymentType={paymentType} 
                        paymentType="credit-card"
                        isSubmitted={isSubmitted}
                        setMessage={setMessage}
                        name="Credit Card"
                        ></PaymentOption>
                    <PaymentOption 
                        img={paypalLogo} 
                        setPaymentType={setPaymentType} 
                        currentPaymentType={paymentType} 
                        paymentType="paypal"
                        isSubmitted={isSubmitted}
                        setMessage={setMessage}
                        name="Pay Pal"
                        ></PaymentOption>
                </div>
            {(
                <>
                <PayPalScriptProvider options={{"client-id": "AdP17URr89DbDrFV6yo1WEHC1F0lf900hz8oqXaH2I8_BMgmu5ZIukifi328vMSQurAbAuSCY_OqQjbT", currency: "EUR"}}>
                    <Elements stripe={stripePromise}>
                    {stripePromise && paymentType === "credit-card" && (isSubmitted || isLogged)? (
                        <StripeForm 
                            itemId={item.id} 
                            itemType={item.subcourses? "course": "subcourse"} credentials={credentials} 
                            couponCode={couponCode}/>
                    ) : paymentType === "paypal" && (isSubmitted || isLogged) ?
                        <PaypalForm  
                            itemId={item.id} 
                            itemType={item.subcourses? "course": "subcourse"} credentials={credentials}
                            couponCode={couponCode} />
                    : null
                    }
                    </Elements>
                    </PayPalScriptProvider>
                </>
                
            )}
            
            </section>
            
        </div>
    )
}
export default Payment;