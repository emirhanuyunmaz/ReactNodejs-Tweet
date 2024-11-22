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


const UserContactModel = mongoose.model("Contact",userContactSchema)

module.exports = {UserContactModel,UserContactModel}