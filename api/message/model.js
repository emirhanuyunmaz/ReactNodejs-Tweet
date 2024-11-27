const mongoose = require("mongoose")
const Schema = mongoose.Schema

/***
 * 
 * senderUserId:Gönderici kullanıcı ID
 * recipientUserId:Alıcı kullanıcı ID
 */

const messageSchema = new Schema({
    senderUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    },
    
    recipientUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUp"
    },
    
    message:String,
    
    isImage:Boolean,
    
    createAt:{
        type:Date,
        default:Date.now
    }
})


const MessageModel = mongoose.model("Message",messageSchema)

module.exports = {MessageModel} 