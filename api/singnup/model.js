const mongoose = require("mongoose")
const Schema = mongoose.Schema

const signUpShema = new Schema({
    name:String,
    surname:String,
    email:String,
    image:String,
    password:String,
    description:String,
    profilePrivate:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


const SignUpModel = mongoose.model("SignUp",signUpShema)

module.exports = SignUpModel