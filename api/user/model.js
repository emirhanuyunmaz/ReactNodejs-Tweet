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

// const userTweetLikeSchema = new Schema({
//     tweetId:String,
//     createAt:{
//         type:Date,
//         default:Date.now
//     }
// })

const userTweetLikeListSchema = new Schema({
    userId:String,
    tweetList:[{type:mongoose.Types.ObjectId , ref:"Tweet"}]
})

const TweetModel = mongoose.model("Tweet",userTweetSchema)

const TweetLikeListModel = mongoose.model("TweetLikeList",userTweetLikeListSchema)

module.exports = {TweetModel,TweetLikeListModel}
