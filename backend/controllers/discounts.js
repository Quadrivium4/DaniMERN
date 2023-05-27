const {Discount, PromotionCode, Review} = require("../models");

const createDiscount = async(req, res) =>{
    console.log('creating discount...')
    const user = req.user;
    const {name, amount, expires, targets} = req.body;
    if(user.role !== "admin") throw new AppError(1, 404, "You are not allowed")
    /* to do: check variables */
    const discount = await Discount.create({
        name,
        amount,
        expires: Date.now() + 1000 * 60 * 60 * 24 * expires,
        targets
    })
    console.log("discount created:", discount)
    
}
const getDiscounts = async (req, res) => {
    const user = req.user;
    if (user.role !== "admin") throw new AppError(1, 404, "You are not allowed");
    const discounts = await Discount.find({});
    res.send({discounts})
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
    const { name, amount, expires, targets, id } = req.body;
    if (user.role !== "admin") throw new AppError(1, 404, "You are not allowed")
    /* to do: check variables */
    const discount = await Discount.findOneAndUpdate({_id: id},{
        name,
        amount,
        expires: Date.now() + 1000 * 60 * 60 * 24 * expires,
        targets
    },{new: true})
    console.log(discount)
}
const deleteDiscount = async(req, res) =>{
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
    deleteDiscount,
    updateDiscount,
    getDiscount,
    getDiscounts
}