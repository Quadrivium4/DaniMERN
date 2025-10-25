import {useState} from "react";
import { validateCoupon } from "../../../controllers";

const CouponValidation = ({item, setCoupon}) =>{
    const [couponId, setCouponId] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [couponData, setCouponData] = useState();
    const [toggle, setToggle] = useState(true);

    const handleSubmit = () =>{
        if(isValid) return setIsValid(false);

        validateCoupon({couponId, itemId: item.id}).then(res=>{
            setIsValid(true);
            setCouponData(res);
            setCoupon(couponId);
            console.log({res})
        }).catch(err=>{
            alert(err.message);
            setCouponId("");
        })
    }
    return (
        <div className="coupon" style={{display: toggle? "flex" : "block"}}>
            <h3>Buono sconto</h3>
            {toggle? <button onClick={()=>setToggle(false)}>+</button> : 
                <>
                <input disabled={isValid} type="text" value={couponId} onChange={(e)=> setCouponId(e.target.value)}/>
            <button onClick={handleSubmit}>{isValid? "Change": "Validate"}</button>
            {couponData && isValid? (
                <>
                <p>Initial Price: €{(couponData.initial/100).toFixed(2)}</p>
                <p>Discount: {couponData.coupon}%</p>
                <p>Total: €{(couponData.total/100).toFixed(2)}</p>
                </>
                
            ): null}
                </>
            }
        </div>
    )
}
export default CouponValidation;