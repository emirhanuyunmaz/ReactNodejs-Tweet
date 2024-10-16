const express = require("express")
const router = express.Router()
const userSignUpModel = require("../singnup/model")
const jwt = require('jsonwebtoken')

const createToken = (id) => {
    //Bir aylık bir token bilgisi
   return jwt.sign({id:id,exp: Math.floor(Date.now() / 1000) + (60 * 60 * 30)},process.env.TOKEN_SECRET)
}

const createRefreshToken = (id) => {
    //Bir aylık bir token bilgisi
   return jwt.sign({id:id,exp: Math.floor(Date.now() / 1000) + (60 * 60 * 30)},process.env.TOKEN_SECRET)
}

const userLogin = async (req,res) => {
    
    try{
        const user = await userSignUpModel.findOne({email : req.body.email , password : req.body.password})
        console.log("ARANAN KULLANICI :",user);
        if(user === null){
            res.status(404).json({"message":"Kullanıcı bulunamadı."})
        }else{
            const accessToken = createToken(user._id)
            const refreshToken = createRefreshToken(user._id)
            // console.log("Kullanıcıya ait token:",);
            
            res.status(201).json({isSuccess:true,"accessToken":accessToken,"refreshToken":refreshToken})
        }
        
    }catch(err){
        console.log("Aranan kullanıcı bulunamadı:",err);        
        res.status(404).json({"message":"ERROR"})
    }
}

// /login/...

router.route("/").post(userLogin)

module.exports = router