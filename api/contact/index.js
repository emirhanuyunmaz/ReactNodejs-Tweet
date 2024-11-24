const express = require("express")
const router = express.Router()

const {UserContactModel} = require("./model")
const SignUpModel = require("../singnup/model")
const authControl = require("../middleware/auth")
/**
 * takip isteği atma işlemi kullanıcı profil kapalı ise 
 * takip etme 
 * takipçi listesi
*/


//***************** USER FOLLOW ***********************//
//Kullanıcı takip etme işlemi
const userConnectionFollow = async (req,res) => {
    
    // console.log("KULLANICI ID:",req.headers.id);
    // console.log("Takip isteği atıldı:",req.body.userId);
    console.log("TAKİP ETME İŞLEMİ");
    
    try{
        const followedUserId = req.body.userId
        const userId = req.headers.id
        // Eğer kullanıcı varsa takip edilenlere bir kullanıcı eklenecek yoksa bir kullanıcı oluşturulacak
        // const 
        const getUserFollowerData = await UserContactModel.findOne({userId:userId})
        
        console.log("Kullanıcı takip listesi ve takipçi listesi",getUserFollowerData)
        // Kullanıcı takip etme işlemi için ...
        if(getUserFollowerData){
            // Takip etme işlemi
            console.log("Daha önce takip işlemi yapmış");
            await UserContactModel.findOneAndUpdate({userId:userId},{$addToSet : {followed:followedUserId}})
        }else{
            // Takip etme işlemi
            console.log("Daha önce takip işlemi yapmamış");

            const contactModel = new UserContactModel({
                userId:userId,
                followed:[followedUserId],
                
            })
            await contactModel.save()
        }

        // Kullanıcı takipçi ekleme işlemi ...
        const getUserFollowedData = await UserContactModel.findOne({userId:followedUserId})
        console.log("TAKİPÇİ EKLENCEK KULLANICI:::",getUserFollowedData);
        
        if(getUserFollowedData){
            console.log("Daha önce takip veya takipçi eklenmiş");
            await UserContactModel.findOneAndUpdate({userId:followedUserId},{$addToSet : {follower:userId}})
        }else{
            console.log("Daha önce takip veya takipçi eklenmemiş");
            const contactModel = new UserContactModel({
                userId:followedUserId,
                follower:[userId],
            })
            await contactModel.save()
        }
        res.status(201).json({message:"Succes",succes:true})
    }catch(err){
        console.log("Kullanıcı takip ederken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

// ************** USER UNFOLLOW ******************** //
//Kullanıcı takibi bırakma işlemi
const userConnectionUnfollow = async (req,res) => {
    console.log("Kullanıcı takibi bırakma işlemi");
    
    try{
        const followedUserId = req.body.userId
        const userId = req.headers.id
        // Takipçi çıkartma işlemi
        await UserContactModel.findOneAndUpdate({userId:userId},{$pull : {followed:followedUserId}})
        await UserContactModel.findOneAndUpdate({userId:followedUserId},{$pull : {follower:userId}})
        
        res.status(201).json({message:"Succes",succes:true})
    }catch(err){
        console.log("Kullanıcı takibi bırakırken bri hata ile karşılaşıldı .",err);
        res.status(404).json({message:err,succes:false})
    }
}

// 
//Takipçi/Takip Edilen listesini döner.
const contactList = async (req,res) => {
    console.log("Kullanıcı takip etme ve takipçi listesi çekilmesi işlemi");
    // kullanıcının kendini takip ediyor olarak gösterilmemeli.
    try{
        const userId = req.params.id
        // console.log("USER IDIDI:",userId);
        
        const data = await UserContactModel.findOne({userId:userId})
        // console.log("Contact list:",data);
        
        res.status(201).json({message:"succes",succes:true,followed:data.followed.length,follower:data.follower.length})
    }catch(err){
        console.log("Takipçi ve takip edilen listesi çekilirken bir hata ile karşılaşıldı.",err)
        res.status(404).json({message:err,succes:false})
        
    }
}

//************* USER IS FOLLOW **************/
// Bir profile girdiği zaman kullanıcı takip edyor mu diye kontrol işlemi.
const userIsFollow = async (req,res) => {

    try{
        const userId = req.headers.id
        const followedUserId = req.params.id
        const getData = await UserContactModel.findOne({userId:userId}).where("followed").in(followedUserId)
        console.log(getData);

        if(getData){
            res.status(201).json({message:"succes",succes:false,data:true})
        }else{
            res.status(201).json({message:"succes",succes:false,data:false})
        }

    }catch(err){
        console.log("IS follow err:",err);
        res.status(404).json({succes:false,message:err})
    }
}

/**
 * Kullanıcı arama işlemi (isme - soyisme ) 
 * Regex
*/
//*************** USER SEARCH *******************//
const userSearch = async (req,res) => {
    console.log("Arama işlemi yapıldı...");
    try{
        const userId = req.headers.id
        const searchText = req.body.searchText
        // {_id:{$ne:{userId}}},
        
        const getData = await SignUpModel.find({$or:[
            {name:{ $regex: `${searchText}`, $options: 'i' }},
            {surname:{ $regex: `${searchText}`, $options: 'i' } }
        ]}).select("name surname image")
        
        // console.log(getData);
        
        res.status(201).json({message:"succes",succes:true,data:getData})
    }catch(err) {
        console.log("Kullanıcı arama işlemi yapılırken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}
// ******************** USER FOLLOWER LIST ***********************//
// Kullanici takipçi listesindeki kullanıcıları çekme işlemi.
const userFollowerList = async (req,res) => {
    console.log("TAkipçi lsitesi çekilmesi işlemi.");
    
    try{
        console.log("Kullanıcı bilgisi :",req.params.id);
        const userId = req.params.id 
        const data = await UserContactModel.findOne({userId:userId}).populate("follower","name surname image")  
        console.log("*************************");
        console.log(data);
        console.log("*************************");
        
        res.status(201).json({message:"succes",succes:true,data:data.follower})
    }catch(err){
        console.log("TAkipçi listesi çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

// **********************USER FOLLOWED LIST*************************//
// Takip edilen listesini ve kullanıcı bilgisini verecek yapı.
const userFollowedList = async(req,res) => {
    console.log("Takip edilen listsi çekidi.");
    
    try{
        const userId = req.params.id 
        const data = await UserContactModel.findOne({userId:userId}).populate("followed","name surname image")
        console.log("###################################################");
        console.log(data);
        console.log("###################################################");
        
        res.status(201).json({message:"succes",succes:false,data:data.followed})
    }catch(err){
        console.log("Takip edilenler çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}
/**
 * Bildirim ekleme işlemi yapılack beğeni-yorum-takip isteği-
*/

// contact/...
router.route("/follow").post(authControl,userConnectionFollow)
router.route("/unfollow").post(authControl,userConnectionUnfollow)
router.route("/searchUser").post(authControl,userSearch)
router.route("/contactList/:id").get(authControl,contactList)
router.route("/isFollow/:id").get(authControl,userIsFollow)
router.route("/userFollowedList/:id").get(authControl,userFollowedList)
router.route("/userFollowerList/:id").get(authControl,userFollowerList)
module.exports = router