const { isValidObjectId } = require("mongoose");
const { Discount,Course, Subcourse, User} =  require("../models");


const isAffiliateCoupon = async(couponId) =>{
    if (!isValidObjectId(couponId)) return false;
    const user = await User.findById(couponId);
    console.log({user})
    if (!user) return false
    return true;
}
const checkCoupon = async(itemId, couponId)=>{
    
    let total;
    if (!isValidObjectId(couponId) || !isValidObjectId(itemId)) throw new AppError(1, 400, "Invalid Coupon");
    const item = await Subcourse.findById(itemId) || await Course.findById(itemId);

    if(await isAffiliateCoupon(couponId)) {
        total = item.price - item.price / 100 * 10;
        return {total, isAffiliateCoupon: true, item}
    }
    
    const coupon = await Discount.findById(couponId);
    if (!coupon) throw new AppError(1, 400, "Invalid Coupon");
    const isValid = coupon.targets.includes(itemId) && coupon.expires > Date.now();
    if (!isValid) throw new AppError(1, 400, "Invalid Coupon");
    total= item.price - item.price / 100 * coupon.amount;
    return { total, isAffiliateCoupon: false, item}
}
const getDiscountCode = () =>{
    const code = Date.now() + ""
}
module.exports = {
    checkCoupon
}