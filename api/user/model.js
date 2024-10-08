const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userTweetSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"SignUp"
    },
    text:String,
    likes:[],
    comments:[]
},{timestamps:true})


const TweetModel = mongoose.model("Tweet",userTweetSchema)

module.exports = {TweetModel}
