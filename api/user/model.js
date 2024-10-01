const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userTweetSchema = new Schema({
    userId:String,
    text:String,
    likes:[],
    comments:[]
},{timestamps:true})


const TweetModel = mongoose.model("Tweet",userTweetSchema)

module.exports = {TweetModel}
