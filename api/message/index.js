const express = require("express");
const authControl = require("../middleware/auth");
const SignUpModel = require("../singnup/model");
const { MessageModel } = require("./model");
const router = express.Router()

// ********************* GET MESSAGE USER ******************** //
// Daha önce mesajlaşılan kullanıcıların listesi.
const messageUser = async (req,res) => {
    try{
        const id = req.headers.id
        const data = await SignUpModel.find({"_id":{ $ne:id }}).select("name surname image")
        res.status(201).json({message:"succes",succes:true,data:data})
    }catch(err){
        console.log("Mesajlaşılan kullanıcılar çekilirken bir hata ila karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

// ************************ GET ALL MESSAGE ************************** //
// Kullanıcıların mesajlaşma listesi.
const getAllMessage = async(req,res) => {
    try{

        const senderUserId = req.headers.id
        const recipientUserId = req.params.id
        console.log("MESSAGE:::USER:::",senderUserId != "undefined");
        console.log("MESSAGE:::USER:::",recipientUserId != "undefined");
        let data = []
        if(recipientUserId != "undefined" && senderUserId != "undefined"){
            data = await  MessageModel.find({$or:[{senderUserId:senderUserId,recipientUserId:recipientUserId},{senderUserId:recipientUserId,recipientUserId:senderUserId}]})
            console.log("MESSAGE DATA DATA: ",data);
        }
        
        res.status(201).json({message:"succes",succes:true,data:data})
    }catch(err){
        console.log("Mesajlar çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}


router.route("/messageUser").get(authControl,messageUser)
router.route("/messageList/:id").get(authControl,getAllMessage)

module.exports = router