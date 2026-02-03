import { useUser } from "../../../Context.tsx";
const PaymentOption = ({img, setPaymentType, currentPaymentType, paymentType, name, isSubmitted, setMessage})=>{
    const {isLogged} = useUser();
    console.log({paymentType, currentPaymentType, isSubmitted, isLogged})
    let backgroundColor = paymentType === currentPaymentType ?"var(--light)": null;
    const handleClick = () =>{
        console.log(isSubmitted)
       
        if(!isSubmitted && !isLogged) {
             setTimeout(()=>setMessage(null), 3000)
            return setMessage({content: "Registrati!", type: "error"});
        }
        setPaymentType(paymentType);
    }
    return (
        <div className="payment-option" style={{background: backgroundColor} } onClick={handleClick}>
            <img src={img}className="logo" alt={name} />
            <p>{name}</p>
        </div>)
}
export default PaymentOption