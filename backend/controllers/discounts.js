const {Discount, PromotionCode, Review} = require("../models");

const createDiscount = async(req, res) =>{
    const user = req.user;
    const {amount, days, product} = req.body;
    if(user.role !== "admin") throw new AppError(1, 404, "You are not allowed")
    /* to do: check variables */
    const discount = await Discount.create({
        amount,
        expires: Date.now() + 1000 * 60 * 60 * 24 * days,
        product
    })
    
}
const getDiscount = async(req, res) =>{
    const user = req.user;
    const {id} = req.params;
    if (user.role !== "admin") throw new AppError(1, 404, "You are not allowed");
    const discount = await Discount.findOneById(id)
    res.send({
        discount
    })
}
const updateDiscount = async (req, res) => {
    const user = req.user;
    const { amount, days, product } = req.body;
    if (user.role !== "admin") throw new AppError(1, 404, "You are not allowed")
    /* to do: check variables */
    const discount = await Discount.create({
        amount,
        expires: Date.now() + 1000 * 60 * 60 * 24 * days,
        product
    })
}
const removeDiscount = async(req, res) =>{
    const user = req.user;
    const { id } = req.params;
    if (user.role !== "admin") throw new AppError(1, 404, "You are not allowed");
    const discount = await Discount.findByIdAndDelete(id);

}


const createPromotionCode = async(req, res)=>{
    const user = req.user;
    if (user.role !== "admin") throw new AppError(1, 404, "You are not allowed")
    const discount = await PromotionCode.create({

    })
}
module.exports = {
    createDiscount,
    getDiscount
}