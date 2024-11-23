const mongoose = require("mongoose")
const Schema = mongoose.Schema


const tweetComment = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    },
    tweetId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    },
    text:String,
    tag:String,
    createAt:{
        type:Date,
        default:Date.now
    }
})

const userTweetSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"SignUp"
    },
    text:String,
    tag:String,
    userTag:String,
    isImage:String,
    likes:[],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"TweetComment"}],
    
},{timestamps:true})

const userTweetLikeListSchema = new Schema({
    userId:String,
    tweetList:[{type:mongoose.Types.ObjectId , ref:"Tweet"}]
})

const userTweetCommentList = new Schema({
    userId:String,
    tweetList:[{type:mongoose.Types.ObjectId , ref:"TweetComment"}],
    createAt:{
        type:Date,
        default:Date.now
    }
})

// User tasks

const userTasks = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"SignUp"
    },
    text:String,
    userTag:String,
    isImage:String,
})

const TweetModel = mongoose.model("Tweet",userTweetSchema)

const TweetLikeListModel = mongoose.model("TweetLikeList",userTweetLikeListSchema)

const TweetCommentListModel = mongoose.model("TweetCommentList",userTweetCommentList)

const TweetCommentModel = mongoose.model("TweetComment",tweetComment)

const TaskModel = mongoose.model("Tasks",userTasks)

module.exports = {TweetModel,TweetLikeListModel,TweetCommentListModel,TweetCommentModel,TaskModel}
