const express = require("express")
const router = express.Router()
const path = require("path")
const signupModel = require("../singnup/model") //Kullanıcı kayıt olurken kullanılan model
const authControl = require("../middleware/auth")


const getUserProfile = async (req,res) => {
    console.log("Kullanıcı detay sayfası için istek atıldı.");
    // console.log(req.headers.id)
    const id = req.headers.id
    try{
        const userProfile = await signupModel.findOne({_id:id})

        if(userProfile){
            // console.log("Aranan Kullanıcı:",userProfile);
            
            res.status(200).json(userProfile)
        }else{
            res.status(404).json({message:"User Not Found"})
        }
    }catch(err){
        res.status(404).json("ERR getUserProfile:",err)
    }
}


const getUserImage = async(req,res) => {
    const name = req.params.name
    console.log("RESİM ADI:",name);
    
    try{
        // const userProfile = await signupModel.findOne({_id:id})

        if(name){
            // console.log("Aranan Kullanıcı Resmi:",userProfile);
            // const r = path.join(__dirname+user.image)
            // console.log("RESİM::",r);
            
            res.status(200).sendFile(path.join(__dirname+"/../uploads/"+name))
        }else{
            res.status(404).json({message:"User Not Found"})
        }
    }catch(err){
        res.status(404).json("ERR getUserImageProfile:",err)
    }
}

const addTweet = async (req,res) => {
    
}


router.route("/profile/image/:name").get(getUserImage)
router.route("/profile/").get(authControl,getUserProfile)

module.exports = router