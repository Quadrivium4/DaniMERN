const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        rquired: true
    },
    stripeId: {
        type: String,
        trim: true,
    },
    paypalId: {
        type:String,
        trim: true
    },
    profileImg:{
        type: Object,
        default: {}
    },
    allowedReviews: {
        type: Number,
        default: 1
    },
    reviews: {
        type: Array,
        default: []
    },
    role:{
        type: String,
        default: "common"
    },
    courses: {
        type: Array,
        default: []
    },
    subcourses: {
        type: Array,
        default: []
    }
});
const User = mongoose.model("User", UserSchema);
const ReviewSchema = new mongoose.Schema({
    video: {
        name: String,
        duration: Number,
        hashedId: String,
        previewImg: String
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false,
    },
    viewed: {
        type: Boolean,
        default: false
    },
    userId: String,
    pdf: String
});
const Review = mongoose.model("Review", ReviewSchema);

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    subcourses: {
        type: Array,
        default: []
    },
    coverImg: {
        type: Object,
        default: {}
    },
});
const Course = mongoose.model("Course", CourseSchema);
const PaypalOrderSchema  = new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    amount: Number,
    hasAffiliateCoupon: Boolean,
    affiliateCoupon: {
        receiver: String,
        amountInEur: Number
    },
    orderId: String,
    itemId: String,
    itemType: String

})
const PaypalOrder = mongoose.model("PaypalOrder", PaypalOrderSchema);

const SubcourseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    hashedId: {
        type: String,
        required: true
    },
    coverImg: {
        type: Object,
        default: {}
    },
    files: {
        type: Object,
        default: {}
    }
});
const Subcourse = mongoose.model("Subcourse", SubcourseSchema);

const UnverifiedUserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});
const UnverifiedUser = mongoose.model("UnverifiedUser", UnverifiedUserSchema);
const CouponCodeSchema = new mongoose.Schema({
    amount: {
        type: Number
    },
    expires: {
        type: Date,
        default: Date.now() + 1000 * 60 * 60 * 24
    }
})
const CouponCode = mongoose.model("CouponCode", CouponCodeSchema);
const PromotionCodeSchema = new mongoose.Schema({
    user: {
        type: String
    },
    amount: {
        type: Number
    },
    product: {
        type: String
    }
})
const PromotionCode = mongoose.model("PromotionCode", PromotionCodeSchema);
const DiscountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    targets: {
        type: Array,
        require: true
    },
    expires: {
        type: Date,
        default: Date.now() + 1000 * 60 * 60 * 24
    }
})
const Discount = mongoose.model("Discount", DiscountSchema);
module.exports ={
    User,
    Course,
    Subcourse,
    Review,
    PaypalOrder,
    UnverifiedUser,
    Discount,
    PromotionCode,
    CouponCode
}