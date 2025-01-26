const mongoose = require("mongoose")
const Schema = mongoose.Schema

// userId
// fallower => takipçi
// fallowed => takip edilen
// wishList => istekListesi

const userContactSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    },
    follower:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    }],
    followed:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    }]
})

//************BILDIRIM***********// 
const notificationSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    },
    transactionUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    },
    process:String,
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    },
    isShowed:{
        type:Boolean,
        default:false
    },
    followProcess:{
        type:String,
        default:"none"
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
    
})



const UserContactModel = mongoose.model("Contact",userContactSchema)
const UserNotificationModel = mongoose.model("Notification",notificationSchema)

module.exports = {UserContactModel,UserNotificationModel }