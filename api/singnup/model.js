const mongoose = require("mongoose")
const Schema = mongoose.Schema

const signUpShema = new Schema({
    name:String,
    surname:String,
    email:String,
    image:String,
    password:String,
    description:String
},{timestamps:true})


const SignUpModel = mongoose.model("SignUp",signUpShema)

module.exports = SignUpModel