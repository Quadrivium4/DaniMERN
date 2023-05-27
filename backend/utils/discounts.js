const { isValidObjectId } = require("mongoose");
const { Discount,Course, Subcourse} =  require("../models");

const checkCoupon = async(itemId, couponId)=>{
    if (!isValidObjectId(couponId) || !isValidObjectId(itemId)) throw new AppError(1, 400, "Invalid Coupon");
    const coupon = await Discount.findById(couponId);
    if (!coupon) throw new AppError(1, 400, "Invalid Coupon");
    const isValid = coupon.targets.includes(itemId) && coupon.expires > Date.now();
    if (!isValid) throw new AppError(1, 400, "Invalid Coupon");
    const item = await Subcourse.findById(itemId) || await Course.findById(itemId);
    const total= item.price - item.price / 100 * coupon.amount;
    return { coupon, item, total}
}
const getDiscountCode = () =>{
    const code = Date.now() + ""
}
module.exports = {
    checkCoupon
}