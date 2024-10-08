const express = require("express")
const router = express.Router()
const path = require("path")
const signupModel = require("../singnup/model") //Kullanıcı kayıt olurken kullanılan model
const authControl = require("../middleware/auth") //Kullanıcı token bilgisi ile giriş yapıp yapmadığını tespit etme.
const {TweetModel,TweetLikeListModel} = require("./model")


// ************KULLANICI DETAY SAYFASI************** //
// Kullanıcı hakkında detay bilgilerini veren api .
const getUserProfile = async (req,res) => {
    console.log("Kullanıcı detay sayfası için istek atıldı.:",req.headers.id);
    // console.log(req.headers.id)
    const id = req.headers.id
    try{
        // Populate işlemi çalışmıyor.
        const userProfile = await signupModel.findOne({_id:id}).populate("_id","name surname").exec()

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

// *****************Kullanıcı Profil Resmini Çekme İşlemi***************** //
const getUserImage = async(req,res) => {
    const name = req.params.name
    console.log("RESİM ADI:",name);
    
    try{
        if(name){            
            res.status(200).sendFile(path.join(__dirname+"/../uploads/"+name))
        }else{
            res.status(404).json({message:"User Not Found"})
        }
    }catch(err){
        res.status(404).json("ERR getUserImageProfile:",err)
    }
}

// *******************KULLANICI YENİ GÖNDERİ EKLEME İŞLEMİ************************ //
//Kullanıcıya ait bilgiler ile gönderi eklenmesi işlemi .
const addTweet = async (req,res) => {
    // console.log(req.headers);
    // Kullanıcı modeli içerisine user verisi geçilmesi işlemi yapılacak.
    const id = req.headers.id
    const text = req.body.text
    // console.log("IDID::",req.headers.id);
    // console.log("TEXT::",req.body.text);
    
    console.log("Yeni bir tweet için istek atıldı.");
    try{

        // const getUser = await signupModel.findOne({_id:id})
        // console.log("GET USER::",getUser);
        
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

// ******************************TÜM KULLANICILARIN TWEET LİSTESİNİ ÇEKME İŞLEMİ*************************** //
const getTweetList = async (req,res) => {

    try{    
        // Populate ile sadece yazılan verilerin getirilmesine olanak sağlandı .
        const dataList = await TweetModel.find().populate("userId","name surname image").sort({createdAt:"asc"}).exec()
        // console.log(dataList);
         
        res.status(200).json({tweetList:dataList})
        
    }catch(err) {
        console.log("Tweet Listesi çekilirken bir hata ile karşılaşıldı..:",err)
        res.status(404).json({message:"Error",err:err})
    }
}

// *********************KULLANICI BİR TWEET BEĞENDİĞİ ZAMAN YAPILACAK İŞLEMLER******************** //

const likeTweet = async (req,res) => {
    // console.log("LİKELİKELİKE:::",req.headers.id);
    const userId = req.headers.id
    const tweetId = req.body.tweetId
    console.log("TWEETTWEET IDIDID::",tweetId)
    try{
        // Kayıtlı kullanıcı var mı diye kontrol ediliyor .
        const userTweetLikeList = await TweetLikeListModel.find({userId:userId})

        if(userTweetLikeList.length === 0){
            
            // Buradaki model sayesinde kullanıcıya ait beğeni modeli.
            const newUserTweetLike = new TweetLikeListModel({
                userId:userId,
                tweetList:[tweetId]
            })
            await TweetModel.findByIdAndUpdate(tweetId, { $addToSet: { likes: userId } })
            await newUserTweetLike.save()
        }else{
            await TweetModel.findByIdAndUpdate(tweetId, { $addToSet: { likes: userId } })
            await TweetLikeListModel.findOneAndUpdate({userId:userId},{$addToSet:{tweetList:tweetId}})
        }
    }catch(err){
        console.log("Tweet beğeni işlemi sırasında bir hata ile karşılaşıldı:",err)
        res.status(404).json({message:err,succes:false})
    }
    res.status(200).json({message:"Succes",succes:true})
}

//  **********************KULLANICI BEĞENİ LİSTESİNİ GÖNDERME İŞLEMİ******************* //

const getUserLikeList =async (req,res) => {
    const userId = req.headers.id
    try{
        const tweetLikeListData = await TweetLikeListModel.findOne({userId:userId})
        res.status(201).json({data:tweetLikeListData})
    }catch(err){
        console.log("Kullanıcı beğeni listesi çekilirken bir hata ile karşılaşıldı:",err);

        res.status(404).json({message:err,succes:false})
    }
}

// ***********************DİSLİKE İŞLEMİ********************* //
//Beğenilen gönderide beğeni işlemini geri alma işlemi.
const userTweetDislike = async (req,res) => {

    console.log("DİSLİKE:::",req.headers.id);
    console.log("DİSLİKE USER TWEET ID::",req.body.tweetId);

    const tweetId = req.body.tweetId

    const userId = req.headers.id

    try {
        await TweetModel.findByIdAndUpdate(tweetId,{$pull:{likes:userId}})
        await TweetLikeListModel.findOneAndUpdate({userId:userId},{$pull:{tweetList:tweetId}})
        res.status(201).json({message:"succes"})
    } catch(err) {
        console.log("Dislike işlemi yaparken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
    

}


// kullanıcıya ait tweetleri veren api oluşturulacak . 
// /user/...
router.route("/profile/image/:name").get(getUserImage)
router.route("/addTweet").post(authControl,addTweet)
router.route("/tweetList").get(getTweetList)
router.route("/profile").get(authControl,getUserProfile)
router.route("/likeTweet").post(authControl,likeTweet)
router.route("/likeTweetList").get(authControl,getUserLikeList)
router.route("/dislikeTweet").post(authControl,userTweetDislike)


module.exports = router