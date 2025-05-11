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


const resetPasswordCodeSchema = new Schema({
    email:String,
    code:Number
},{timestamps:true})

const SignUpModel = mongoose.model("SignUp",signUpShema)

const ResetPasswordCodeModel = mongoose.model("ResetPasswordCode",resetPasswordCodeSchema)

module.exports = {SignUpModel,ResetPasswordCodeModel}