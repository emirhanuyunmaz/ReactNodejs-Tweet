const express = require("express")
const router = express.Router()
const path = require("path")
const signupModel = require("../singnup/model") //Kullanıcı kayıt olurken kullanılan model
const authControl = require("../middleware/auth") //Kullanıcı token bilgisi ile giriş yapıp yapmadığını tespit etme.
const {TweetModel,TweetLikeListModel,TweetCommentListModel,TweetCommentModel} = require("./model")


// ************KULLANICI DETAY SAYFASI************** //
// Kullanıcı hakkında detay bilgilerini veren api .
const getUserProfile = async (req,res) => {

    try{
        const id = req.headers.id
        // Populate işlemi çalışmıyor.
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

// *****************Kullanıcı Profil Resmini Çekme İşlemi***************** //
const getUserImage = async(req,res) => {
    
    try{
        const name = req.params.name
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
    // Kullanıcı modeli içerisine user verisi geçilmesi işlemi yapılacak.    
    try{
        const id = req.headers.id
        const text = req.body.text

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
    try{
        const userId = req.headers.id
        const tweetId = req.body.tweetId
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
    try{
        const userId = req.headers.id
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

    try {
        const tweetId = req.body.tweetId
    
        const userId = req.headers.id

        await TweetModel.findByIdAndUpdate(tweetId,{$pull:{likes:userId}})
        await TweetLikeListModel.findOneAndUpdate({userId:userId},{$pull:{tweetList:tweetId}})
        res.status(201).json({message:"succes"})
    } catch(err) {
        console.log("Dislike işlemi yaparken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}
// **********************YORUM YAPMA İŞLEMİ******************** //
//Yorum ekleme ve bunların veritabanına kaydedilmesi işlemi.
const commentTweet = async(req,res) => {
    console.log("Yorum ekleme için istek atıldı.");
    
    try{
        const userId = req.headers.id
        const tweetId = req.body.tweetId
        const text = req.body.text

        const userCommentList = await TweetCommentListModel.findOne({userId:userId})        

        if(!userCommentList){
            console.log("Daha önce bir yorum yapmamış");

            const newComment = new TweetCommentModel({
                text:text,
                userId:userId,
                tweetId:tweetId
            })

            const newC = await newComment.save()
            
            const userNewTweetComment = new TweetCommentListModel({
                userId:userId,
                tweetList:[newC._id]
            })
            await userNewTweetComment.save()
            await TweetModel.findByIdAndUpdate(tweetId,{$push : {comments:newC._id}})
            
        }else{
            console.log("Daha önce bir yorum yapmış.");
            const newComment = new TweetCommentModel({
                text:text,
                userId:userId,
                tweetId:tweetId
            })

            const newC = await newComment.save()

            await TweetCommentListModel.findOneAndUpdate({userId:userId},{$push :{tweetList:newC._id}})
            await TweetModel.findByIdAndUpdate(tweetId,{$push : {comments:newC._id}})

        }
        
    } catch(err) {
        console.log("Tweete yorum eklerken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
    res.status(201).json({message:"succes",succes:true})
}

//******************************TWEET YORUMLARINI LİSTE OLARAK DÖNEN FONK.********************* */
//
const getTweetCommentList = async (req,res) => {

    try{
        const tweetId = req.params.id
        const data = await TweetModel.findById(tweetId).populate({path:"comments",select:"text createAt",populate:{path:"userId",select:"name surname image"}}).populate("userId","name surname image").exec()
        
        res.status(201).json({message:"Succes",succes:true,data:data.comments})

    }catch(err){
        console.log("Yorum listesi çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }

}
//***************************BİR TWEETİ YORUM EKLEME VE YORUMLARI GÖRMEK İŞLEMİ********************************/

const singleTweet = async (req,res) => {
    try{
        const tweetId = req.params.id
        // console.log("PARAMS IDIDIDI:",req.params.id)
        const tweetData = await TweetModel.findById(tweetId).populate("userId","name surname image")
        res.status(201).json({succes:true,message:"Succes",data:tweetData})

    } catch(err) {
        console.log("Bir tweet çekilirken hata ile karşılaşıldı :",err);
        res.status(404).json({message:err,succes:false})
    }
}

//************************USER TWEET PROFILE********************* */
//Kullanıcıya ait tweet listesini gösterecek olan api.
const userTweetProfile = async(req,res) => {

    try{
        const tweetUserId = req.params.id
        const tweetData = await TweetModel.find({userId:tweetUserId}).populate("userId","name surname image")
        
        res.status(201).json({message:"Succes",succes:true,data:tweetData})

    }catch(err) {

        console.log("Kullanıcıya ait tweet çekilirken bir hata ile karşılaşıldı . ",err);
        res.status(404).json({message:err,succes:false})
    }
}

const userShortProfile = async (req,res) => {
    try{

        const loginUserId = req.headers.id
        const userData = await signupModel.findById(loginUserId).select("name surname description image email createdAt")
        
        res.status(201).json({message:"Succes",succes:true,data:userData})
    }catch(err) {

        console.log("Kısa profil gösterilirken bir hata ile karşılaşıldı.");
        res.status(404).json({message:err,succes:false})
    }
}


// kullanıcıya ait tweetleri veren api oluşturulacak . 
// /user/...
router.route("/profile/image/:name").get(getUserImage)
router.route("/singleTweet/:id").get(authControl,singleTweet)
router.route("/getTweetComment/:id").get(authControl,getTweetCommentList)
router.route("/addTweet").post(authControl,addTweet)
router.route("/addTweetComment").post(authControl,commentTweet)
router.route("/tweetList").get(getTweetList)
router.route("/profile").get(authControl,getUserProfile)
router.route("/tweetProfile/:id").get(authControl,userTweetProfile)
router.route("/shortProfile/:id").get(authControl,userShortProfile)
router.route("/likeTweet").post(authControl,likeTweet)
router.route("/likeTweetList").get(authControl,getUserLikeList)
router.route("/dislikeTweet").post(authControl,userTweetDislike)


module.exports = router