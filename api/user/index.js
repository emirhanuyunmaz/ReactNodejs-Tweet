const express = require("express")
const router = express.Router()
const path = require("path")
const signupModel = require("../singnup/model") //Kullanıcı kayıt olurken kullanılan model
const authControl = require("../middleware/auth") //Kullanıcı token bilgisi ile giriş yapıp yapmadığını tespit etme.
const {TweetModel} = require("./model")


// ************KULLANICI DETAY SAYFASI************** //
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
    // console.log(req.headers);
    const id = req.headers.id
    const text = req.body.text
    console.log("IDID::",req.headers.id);
    console.log("TEXT::",req.body.text);
    
    console.log("Yeni bir tweet için istek atıldı.");
    try{

        const getUser = await signupModel.findOne({_id:id})
        console.log("GET USER::",getUser);
        
        const newTweet = new TweetModel({
            userId:id,
            text:text
        })

        await newTweet.save().then(() => console.log("Saved Tweet"))
        res.status(200).json({message:"Succes"})
    }catch(err){
        console.log("Yeni tweet atarken bir hata ile karşılaşıldı..:",err);
        res.status(404).json({message:"Error"})
    }
}

const getTweetList = async (req,res) => {

    let tweetArr = []

    try{

        const dataList = await TweetModel.find().sort({createdAt:"asc"}).exec()
        
        // console.log("**************");
        
        const promise = dataList.map(async (tweet) => {
            console.log("TWEET::",tweet);
            const getUser = await signupModel.findOne({_id:tweet.userId})
            console.log("USER::;",getUser);
            
            let userTweet = {
                id:tweet._id,
                userId:getUser._id,
                userName:getUser.name,
                userSurname:getUser.surname,
                userImage:getUser.image,
                text:tweet.text,
                likes:tweet.likes,
                comments:tweet.comments,
                createAt:tweet.createdAt
            }
            tweetArr.push(userTweet)
        })

        await Promise.all(promise)
        console.log(tweetArr);
        console.log("#####");
        
        res.status(200).json({tweetList:tweetArr})
        
    }catch(err) {
        console.log("Tweet Listesi çekilirken bir hata ile karşılaşıldı..:",err)
        res.status(404).json({message:"Error",err:err})
    }


}


router.route("/profile/image/:name").get(getUserImage)
router.route("/addTweet").post(authControl,addTweet)
router.route("/tweetList").get(getTweetList)
router.route("/profile/").get(authControl,getUserProfile)


module.exports = router