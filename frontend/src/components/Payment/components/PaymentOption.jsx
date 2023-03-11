import { useUser } from "../../../Context";
const PaymentOption = ({img, setPaymentType, currentPaymentType, paymentType, name, isSubmitted, setMessage})=>{
    const {isLogged} = useUser();
    console.log({paymentType, currentPaymentType})
    let backgroundColor = paymentType === currentPaymentType ?"rgb(15,20,55)": null;
    const handleClick = () =>{
        console.log(isSubmitted)
        if(!isSubmitted && !isLogged) return setMessage({content: "Registrati!", type: "error"});
        setPaymentType(paymentType);
    }
    return (
        <div className="payment-option" style={{background: backgroundColor} } onClick={handleClick}>
            <img src={img}className="logo" alt={name} />
            <p>{name}</p>
        </div>)
}
export default PaymentOption