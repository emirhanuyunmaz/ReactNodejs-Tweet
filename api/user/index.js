const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")
const ObjectId = require('mongoose').Types.ObjectId //Buradaki işlem agregate de kullanmak için gerekli
const signupModel = require("../singnup/model") //Kullanıcı kayıt olurken kullanılan model
const authControl = require("../middleware/auth") //Kullanıcı token bilgisi ile giriş yapıp yapmadığını tespit etme.
const {TweetModel,TweetLikeListModel,TweetCommentListModel,TweetCommentModel,TaskModel} = require("./model")
const {UserContactModel} = require("../contact/model")
const uuid = require("uuid")
const { default: axios } = require("axios")
const SignUpModel = require("../singnup/model")


// Kullanıcı Profil resmini güncelleme işlemi .
const upl = async (req,res) => {
    console.log("Kullanıcı resim değiştirmek için istek attı.");
    
    
    try{
        // console.log("İMAGE:",req.body.image);
        // console.log("Kullanıcı id bilgisi::",req.headers.id);
        
        const id = req.headers.id
        const user = await SignUpModel.findById(id)

        const imageName = user.image.split("uploads/").pop()
        
        const filePath = `/uploads/${imageName}`
        console.log("File Path:",filePath);
        let base64Image = req.body.image.split(';base64,').pop();
        
        fs.writeFile(__dirname + "/.." + filePath ,base64Image , {encoding: 'base64'}, function(err) {
            console.log(`File created ${imageName} `);
        });
        res.status(201).json({message:"succes",isSucces:true})
    }catch(err){
        console.log("Kullanıcı profil resmi güncellenirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,isSucces:false})
    }

}

// ************GET USER PROFILE************** //
// Kullanıcı hakkında detay bilgilerini veren api .
const getUserProfile = async (req,res) => {

    try{
        const id = req.headers.id
        // console.log("Kullanıcı bilgisi:",req.headers);
        
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

// ********************UPDATE PROFILE******************** //
// Kullanıcı profili güncelleme işlemi ...
const updateUserProfile = async (req,res) => {

    try{
        const id = req.headers.id
        const body = req.body
        console.log("BODY::",req.body);
        
        console.log("Update User id:",id);

        const user = await signupModel.findByIdAndUpdate(id,body)
        console.log("ARANAN KULLANICI::",user);
        

        res.status(201).json({message:"succes",succes:true})

    }catch(err){
        console.log("Profil güncellenirken bir hata ile karşılaşıldı .",err);
        
        res.status(404).json({message:err,succes:false})
    }

}


// *****************GET USER IMAGE***************** //
//Kullanıcı Profil Resmini Çekme İşlemi
const getUserImage = async(req,res) => {
    // console.log("******************************");
    // console.log("RESİM ÇEKME İŞLEMİ :",req.params);
    
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

// *******************ADD TWEET************************ //
//Kullanıcıya ait bilgiler ile gönderi eklenmesi işlemi .
const addTweet = async (req,res) => {
    // Kullanıcı modeli içerisine user verisi geçilmesi işlemi yapılacak.
    try{
        console.log("TWEET EKLENDİ");
        
        const id = req.headers.id
        const text = req.body.text
        const userTag = req.body.userTag
        const isImage = req.body.isImage
        console.log("İmage: ",req.body);
        // console.log("LLLL:",text);
        

        if(text && !isImage){
            // console.log("USER TAG:",userTag)
            // console.log("TEXT:",text);
                        
            // Veriyi flask kullanarak oluşturlan bir api den çekme işlemi.
            const predictionResponse = await axios.post("http://127.0.0.1:5000/predict",{
                text:text
            })
    
            // console.log("GELEN VERİİ:::",predictionResponse.data.prediction);
            
            
            const newTweet = new TweetModel({
                userId:id,
                text:text,
                tag:predictionResponse.data.prediction,
                userTag:userTag
            })
    
            await newTweet.save().then(() => console.log("Saved Tweet"))
            res.status(200).json({message:"Succes"})
        }
        else if(text && isImage){
            console.log("Resim gelimiş");

            const imageName = uuid.v4()
            const filePath = `/uploads/${imageName}.png`
            console.log("File Path:",filePath);
            let base64Image = req.body.text.split(';base64,').pop();
            // Veriyi flask kullanarak oluşturlan bir api den çekme işlemi.
            const predictionResponse = await axios.post("http://127.0.0.1:5000/predictImage",{
                text:base64Image
            })
            
            console.log("Resim sınıflandırma sonucu :",predictionResponse.data.prediction);
            
            
            fs.writeFile(__dirname +"/.." + filePath ,base64Image , {encoding: 'base64'}, function(err) {
                console.log(`File created ${imageName} `);
            });

            const newTweet = new TweetModel({
                userId:id,
                isImage:true,
                text :filePath,
                tag:predictionResponse.data.prediction,
                userTag:userTag
            })
    
            await newTweet.save().then(() => console.log("Saved Tweet"))
            res.status(200).json({message:"Succes"})

        }
    }catch(err){
        console.log("Yeni tweet atarken bir hata ile karşılaşıldı..:",err);
        res.status(404).json({message:"Error"})
    }
}

// ************************DELETE TWEET******************** //
//Tweeti silme işlemi .
const deleteTweet = async (req,res) => {

    try{
        const id = req.body.id
        
        const tweetData = await TweetModel.findByIdAndDelete(id)

        if(tweetData.isImage == true){
            const imageName =tweetData.text.split("image/").pop()

            fs.rmSync(__dirname+"/.."+`/uploads/${imageName}`)
        }
        
        res.status(201).json({message:"succees",succes:true})
    }catch(err){
        console.log("Tweet silinirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }

}

// ******************************GET TWEET LIST*************************** //
//Tüm tweet listesini çekme işlemi. 
const getTweetList = async (req,res) => {
    // console.log("TWEETDATA:::",typeof(req.headers.is_followed_data));
    
    try{    
        const followedData = req.headers.is_followed_data
        const userId = req.headers.id            
        if(followedData == "true"){
            const contactData = await UserContactModel.findOne({userId:userId})
            // Populate ile sadece yazılan verilerin getirilmesine olanak sağlandı . 
            console.log("AA:",contactData);
                       
            if(contactData){
                contactData.followed.push(userId)
                const dataList = await TweetModel.find({userId:{$in:contactData.followed}}).populate("userId","name surname image tag profilePrivate").sort({createdAt:"desc"}).exec()
                // console.log(dataList);
                res.status(200).json({tweetList:dataList})
            }else{
                res.status(200).json({tweetList:[]})
            }

        }else{
            const contactData = await UserContactModel.findOne({userId:userId})
            
            const tweetLikeListData = await TweetLikeListModel.findOne({userId:userId})
            const userLike = tweetLikeListData ? tweetLikeListData.tweetList : []
            // console.log("BEĞENİ LİST::",userLike);
            let liste = [] //Kullanıcı gönderi gösterme listesi.
            liste.push(contactData?.followed)
            liste.push(userId)
            // contactData?.followed?.push(userId)
            console.log(liste);
            // contactData.followed.push(userId)
            const data = await TweetModel.aggregate([
                // 1. `userId` ile `SignUp` bilgilerini birleştir
                {
                  $lookup: {
                    from: 'signups', // SignUp koleksiyon adı
                    localField: 'userId', // Tweet modelindeki userId
                    foreignField: '_id', // SignUp modelindeki _id
                    as: 'userId', // Kullanıcı bilgilerini getir
                  },
                },
                {
                  $unwind: '$userId', // userId dizisini aç
                },
          
                {
                  $match: {
                    $or: [
                      { 'userId.profilePrivate': false }, 
                      { "userId._id": { $in: liste } },
                    ],
                    // $and:[
                    //     {_id : {$in : userLike}}
                    // ]
                  },
                },
          
                // 3. İstenen alanları seç
                {
                    $project: {
                        _id: 1, // Tweet ID
                        text: 1, // Tweet içeriği
                        tag: 1,
                        userTag: 1,
                        isImage: 1,
                        likes: 1,
                        comments:1,
                        createdAt: 1,
                        'userId._id': 1, 
                        'userId.name': 1, 
                        'userId.surname': 1,
                        'userId.email': 1,
                        'userId.image': 1,
                        'userId.tag': 1,
                        'userId.profilePrivate': 1,
                        userIsFollow: {
                            $cond: {
                                if: { $in: ['$_id', userLike] }, // Eğer tweet'in _id'si `userLike` içinde varsa
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                { $sort: { createdAt: -1 } }, // En yeni tweetler önce gelir
              ]);
            // console.log(data);
            console.log("Kullanıcı tweet listesi çekildi.");
            
            res.status(200).json({tweetList:data})
        }
         
        
    }catch(err) {
        console.log("Tweet Listesi çekilirken bir hata ile karşılaşıldı..:",err)
        res.status(404).json({message:"Error",err:err})
    }
}

// *********************TWEET LIKE******************** //
//Bir tweet beğenme işlemi.
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

//  **********************USER LIKE LIST******************* //
//Giriş yapan kullanıcıya ait beğeni listesi.
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
// **********************COMMENT TWEET******************** //
//Yorum ekleme ve bunların veritabanına kaydedilmesi işlemi.
const commentTweet = async(req,res) => {
    console.log("Yorum ekleme için istek atıldı.");
    
    try{
        const userId = req.headers.id
        const tweetId = req.body.tweetId
        const text = req.body.text
        const predictionResponse = await axios.post("http://127.0.0.1:5000/predict",{
            text:text
        }) 
        const userCommentList = await TweetCommentListModel.findOne({userId:userId})        
                
        if(!userCommentList){
            console.log("Daha önce bir yorum yapmamış");

            const newComment = new TweetCommentModel({
                text:text,
                userId:userId,
                tweetId:tweetId,
                tag:predictionResponse.data.prediction
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
                tweetId:tweetId,
                tag:predictionResponse.data.prediction
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

//******************************TWEET COMMENT LIST********************* */
//Tweete ait yorum listesi .
const getTweetCommentList = async (req,res) => {

    try{
        const tweetId = req.params.id
        const data = await TweetModel.findById(tweetId).populate({path:"comments",select:"text createAt tag",populate:{path:"userId",select:"name surname image"}}).exec()
        const commentTagList = await TweetCommentModel.aggregate([
            
            { "$match": { "tweetId": new ObjectId(tweetId) } },
            {
                $group :{
                    _id:'$tag',
                    count:{ $sum: 1 }
                }
            }
        ])
        // const commentsLLL = await TweetCommentModel.find({tweetId:tweetId})
        console.log("TWEET TAG::",commentTagList);
        
        
        res.status(201).json({message:"Succes",succes:true,data:data.comments,commentTagList:commentTagList})

    }catch(err){
        console.log("Yorum listesi çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }

}
//***************************SINGLE TWEET********************************/
//Bir tweete ait yorumları görme ve yorum ekleme işlemi.
const singleTweet = async (req,res) => {
    try{
        const tweetId = req.params.id
        const userId = req.headers.id
        console.log("PARAMS IDIDIDI:",userId)
        let tweet_id = new ObjectId(tweetId);
        // const tweetData = await TweetModel.findById(tweetId).populate("userId","name surname image")

        const tweetLikeListData = await TweetLikeListModel.findOne({userId:userId})
        const userLike = tweetLikeListData ? tweetLikeListData.tweetList : []

        const tweetData = await TweetModel.aggregate([
            {
                $lookup: {
                from: 'signups', // SignUp koleksiyon adı
                localField: 'userId', // Tweet modelindeki userId
                foreignField: '_id', // SignUp modelindeki _id
                as: 'userId', // Kullanıcı bilgilerini getir
                },
                
            },
            {
                $unwind: '$userId', // userId dizisini aç
            },
            {
                $match :{ 
                    
                    $and :[ {_id: {$in:[tweet_id]}} ]
                    
                }
            },
            {$project: {
                _id: 1, // Tweet ID
                text: 1, // Tweet içeriği
                tag: 1,
                userTag: 1,
                isImage: 1,
                likes: 1,
                comments:1,
                createdAt: 1,
                'userId._id': 1, 
                'userId.name': 1, 
                'userId.surname': 1,
                'userId.email': 1,
                'userId.image': 1,
                'userId.tag': 1,
                'userId.profilePrivate': 1,
                userIsFollow: {
                    $cond: {
                        if: { $in: ['$_id', userLike] }, // Eğer tweet'in _id'si `userLike` içinde varsa
                        then: true,
                        else: false
                    }
                }
            }  
        }
        ])
        
        console.log("L:",tweetData);
        
        res.status(201).json({succes:true,message:"Succes",data:tweetData[0]})

    } catch(err) {
        console.log("Bir tweet çekilirken hata ile karşılaşıldı :",err);
        res.status(404).json({message:err,succes:false})
    }
}

//************************USER TWEET PROFILE********************* */
//Kullanıcıya ait tweet listesini gösterecek olan api.
const userTweetProfile = async(req,res) => {
    console.log("Single user tweet",);
    
    try{
        const searchText = req.headers.text
        const tweetUserId = req.params.id
        // const tweetData = await TweetModel.find({userId:tweetUserId,text:{ $regex: `${searchText}`, $options: 'i' } }).populate("userId","name surname image").sort({createdAt:"desc"}).exec()

        const tweetLikeListData = await TweetLikeListModel.findOne({userId:tweetUserId})
        const userLike = tweetLikeListData ? tweetLikeListData.tweetList : []

        const tweet_user_id = new ObjectId(tweetUserId)

        // ***************** //
        const tweetData = await TweetModel.aggregate([
            {
                $lookup: {
                from: 'signups', // SignUp koleksiyon adı
                localField: 'userId', // Tweet modelindeki userId
                foreignField: '_id', // SignUp modelindeki _id
                as: 'userId', // Kullanıcı bilgilerini getir
                },
                
            },
            {
                $unwind: '$userId', // userId dizisini aç
            },
            {
                $match :{ 
                    
                    $and :[ 
                        {"userId._id": {$in:[tweet_user_id]}},
                        {"text" : new RegExp('^' + searchText, "i")}
                    
                    ]
                    
                }
            },
            {$project: {
                _id: 1, // Tweet ID
                text: 1, // Tweet içeriği
                tag: 1,
                userTag: 1,
                isImage: 1,
                likes: 1,
                comments:1,
                createdAt: 1,
                'userId._id': 1, 
                'userId.name': 1, 
                'userId.surname': 1,
                'userId.email': 1,
                'userId.image': 1,
                'userId.tag': 1,
                'userId.profilePrivate': 1,
                userIsFollow: {
                    $cond: {
                        if: { $in: ['$_id', userLike] }, // Eğer tweet'in _id'si `userLike` içinde varsa
                        then: true,
                        else: false
                    }
                }
            }  
        }
        ])

        // ***************** //

        const userId = req.headers.id
        const userProfile = userId == tweetUserId
        console.log("Kullanıcı profili mi ? = ",userProfile);
        
        console.log("TWEET_DATA:",tweetData);
        

        res.status(201).json({message:"Succes",succes:true,data:tweetData,userProfile:userProfile,isUser:true})

    }catch(err) {

        console.log("Kullanıcıya ait tweet çekilirken bir hata ile karşılaşıldı . ",err);
        res.status(404).json({message:err,succes:false})
    }
}

// ************************SHORT PROFİLE************************ //
//Kullanıcıya ait bilgilerin gösterilmesi.(şifre bilgisi yok)
const userShortProfile = async (req,res) => {
    try{
        const loginUserId = req.params.id
        const id = req.headers.id
        console.log("ID",loginUserId);
        console.log("LOGİNID",id);
        console.log(loginUserId == id);
        
        // console.log("Kullanıcı id:",loginUserId != "undefined");
        let userData = null
        if(loginUserId != "undefined"){
            userData = await signupModel.findById(loginUserId).select("name surname description image email profilePrivate createdAt")
        }
        res.status(201).json({message:"Succes",succes:true,data:userData,isUserProfile:loginUserId == id})
    }catch(err) {
        console.log("Kısa profil gösterilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

// **********************GET TAG LIST********************* //
//Tweetlere ait etiketleri sayma ve geri döndürme işlemi
const getTagList = async (req,res) => {
    // Goup işlemi ile kaç tane olacagı belirlenecek .

    try{
        //Buradaki işlem sayesinde "tag" a göre gruplandırma ve içerisindeki verileri sayma işlemi yaptık.
        const data = await TweetModel.aggregate([
            {
                $group :{
                    _id:'$tag',
                    count:{ $sum: 1 }
                }
            }
        ])
        // console.log(data);
        
        res.status(201).json({message:"succes",succes:true,data:data})
    }catch(err){
        console.log("Etiket listesini çekerken bir hata ile karşılaşıldı .",err);
        res.status(404).json({message:err,succes:false})   
    }
}

// ********************GET USER TAG********************** //
//userTag listesinin çekilmesi ve tweet sayısının gönderilmesi işlemi.
const getUserTagList = async (req,res) => {
    console.log("Kullanıcı etiket listesi çekmek için istek atıldı.");
    
    try{
        //Buradaki işlem sayesinde "tag" a göre gruplandırma ve içerisindeki verileri sayma işlemi yaptık.
        const data = await TweetModel.aggregate([
            {
                $group :{
                    _id:'$userTag',
                    count:{ $sum: 1 }
                }
            }
        ])
        res.status(201).json({message:"succes",succes:true,data:data})
    }catch(err) {
        console.log("Kullanıcı etiket listesi çekilirken bir hata ile karşılaşıldı:",err)
        res.status(401).json({message:err,succes:false})
    }
}

// *******************SINGLE TAG TWEET LIST****************** //
//Sadece bir etikete ait tweet listesi.
const getSingleUserTag = async (req,res) => {
    // console.log("Etikete ait gönderileri çekme işlemi.");
    try{
        const userTag = req.params.tag
        const tweetData = await TweetModel.find({userTag:userTag}).populate("userId","name surname image")
        
        //Buradaki işlem sayesinde "tag" a göre gruplandırma ve içerisindeki verileri sayma işlemi yaptık.
        const emotionTagData = await TweetModel.aggregate([
            { "$match": { "userTag": userTag } },
            {
                $group :{
                    _id:'$tag',
                    count:{ $sum: 1 }
                }
            }
        ])
        res.status(201).json({message:"succes",succes:true,data:tweetData,tagData:emotionTagData})
    }catch(err){
        console.log("Etikete ait gönderiler çekilirken bir hata ile karşılaşıldı.",err);
        
        res.status(404).json({message:err,succes:false})
    }
}
//*************ADD TASK*********************//
//Kullanıcıya ait task kaydetme işlemi.
const addTask = async (req,res) => {

    try{
        const userId = req.headers.id
        const isImage = req.body.isImage
        const text = req.body.text
        const userTag = req.body.userTag
        
        if(isImage && text){

            const imageName = uuid.v4()
            const filePath = `/uploads/${imageName}.png`
            console.log("File Path:",filePath);
            let base64Image = req.body.text.split(';base64,').pop();
            fs.writeFile(__dirname+"/.."+filePath ,base64Image , {encoding: 'base64'}, function(err) {
                console.log(`File created ${imageName} `);
            });

            const newTask = new TaskModel({
                userId:userId,
                isImage:isImage,
                text:filePath,
                userTag:userTag
            })
            await newTask.save()

        }else{
            const newTask = new TaskModel({
                userId:userId,
                isImage:isImage,
                text:text,
                userTag:userTag
            })
            await newTask.save()

        }        
        res.status(201).json({message:"succes",succes:true})
    }catch(err){
        console.log("Task oluşturulurken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
        
    }
}

//******************GET SINGLE TASK ***************************//

const getSingleTask = async(req,res) => {
    try{
        const taskId = req.params.id
        const data = await TaskModel.findById(taskId)
        res.status(201).json({message:"succes",succes:true,data:data})
    }catch(err){
        console.log("Tek task çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}



//********** GET TASK LIST ****************//
// Kullanıcıya ait taskları listeleme işlemi
const getTaskList = async (req,res) => {
    try{
        const userId = req.headers.id
        const data = await TaskModel.find({userId:userId})
        res.status(201).json({message:"succes", succes:true,data:data})
    }catch(err){
        console.log("Task listesi çekilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}
//******************DELETE TASK********************//
// Task silme işlemi
const deleteTask = async (req,res) => {
    console.log("..Task silme işlemi.");
    
    try{
        const taskId = req.body.taskId
        const task = await TaskModel.findByIdAndDelete(taskId)
        console.log("TASK SİL:",task);
        
        if(isImage = "true"){
            const imageName = task.text.split("image/").pop()
            fs.rmSync(__dirname+"/.."+`/uploads/${imageName}`)
        }
        res.status(201).json({message:"succes",succes:true})
    }catch(err){
        console.log("Task silinirken bir hata ile karşılaşıldı .",err)
        res.status(404).json({message:err,succes:false})
    }
}

//*********************TASK TO TWEET*******************// 
// Kaydedilen bir task tweet olarak atma işlemi.
const taskToTweet = async (req,res) => {
    
    console.log("Task tweet atma işlemi...");
    
    try{
        const getTaskId = req.body._id
        const task = await TaskModel.findByIdAndDelete(getTaskId)
        // console.log(task);
    
        if(task.isImage){
            console.log("Resim var");
            const taskImageName = task.text.split("uploads/").pop()
            
            const imageData = fs.readFileSync(__dirname+"/.."+`/uploads/${taskImageName}`,{encoding:'base64'})
            // console.log("RESİM:",imageData[2]);
            // Veriyi flask kullanarak oluşturlan bir api den çekme işlemi.
            const predictionResponse = await axios.post("http://127.0.0.1:5000/predictImage",{
                text:imageData
            })

            const newTweet = new TweetModel({
                userId:task.userId,
                text:task.text,
                isImage:true,
                tag:predictionResponse.data.prediction,
                userTag:task.userTag,
            })
            await newTweet.save()

        }else{
            console.log("resim yok");

            // Veriyi flask kullanarak oluşturlan bir api den çekme işlemi.
            const predictionResponse = await axios.post("http://127.0.0.1:5000/predict",{
                text:task.text
            })
            const newTweet = new TweetModel({
                userId:task.userId,
                text:task.text,
                isImage:false,
                tag:predictionResponse.data.prediction,
                userTag:task.userTag,
            })
            await newTweet.save()
        }
        res.status(201).json({message:"succes",succes:true})
    }catch(err){
        console.log("Task tweet olarak atılırken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

// *********************** UPDATE TASK ********************* //
//Task güncelleme veya düzenleme işlemi.
const updateTask = async (req,res) => {
    try{
        const id = req.body._id
        const body = req.body
        await TaskModel.findByIdAndUpdate(id,body)
        res.status(201).json({message:"succes",succes:true})
    }catch(err){
        console.log("Task güncellerken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

const taskImageUpdate = async (req,res) => {
    console.log("Task resim güncelleme işlemi");
    
    try{
        const taskId = req.body.taskId
        // console.log("RESİM VAR MI:",req.body.image);
        if(req.body.image){
            const updateImageName =  uuid.v4()

            const image = req.body.image.split(';base64,').pop();
            // console.log("RESİM:",image);
            const task = await TaskModel.findById(taskId)
            
            const imageName = task.text.split("image/").pop()
            fs.rmSync(__dirname+"/.."+`${imageName}`)


            const filePath = __dirname + `/../uploads/${updateImageName}.png`
            fs.writeFile(filePath ,image , {encoding: 'base64'}, function(err) {
                console.log(`File created ${updateImageName+".png"} `);
            });

            await TaskModel.findByIdAndUpdate(taskId,{text:"/uploads/"+updateImageName+".png"})
            res.status(201).json({succes:true,message:"succes"})
        }else{
            res.status(401)
        }

    }catch(err) {
        console.log("Task resmi güncellenirken bir hata ile karşılaşıldı.",err)
        res.status(404).json({succes:false,message:err})
    }
}


// kullanıcıya ait tweetleri veren api oluşturulacak . 
// /user/...
router.route("/profile/image/:name").get(getUserImage)
router.route("/singleTweet/:id").get(authControl,singleTweet)
router.route("/getTweetComment/:id").get(authControl,getTweetCommentList)
router.route("/addTweet").post(authControl,addTweet)
router.route("/deleteTweet").delete(authControl,deleteTweet)
router.route("/getTagList").get(authControl,getTagList)
router.route("/getUserTagList").get(authControl,getUserTagList)
router.route("/getSingleUserTag/:tag").get(authControl,getSingleUserTag)
router.route("/addTweetComment").post(authControl,commentTweet)
router.route("/tweetList").get(authControl,getTweetList)
router.route("/profile").get(authControl,getUserProfile)
router.route("/updateProfile").post(authControl,updateUserProfile)
router.route("/updateImage").post(authControl,upl)
router.route("/tweetProfile/:id").get(authControl,userTweetProfile)
router.route("/shortProfile/:id").get(authControl,userShortProfile)
router.route("/likeTweet").post(authControl,likeTweet)
router.route("/likeTweetList").get(authControl,getUserLikeList)
router.route("/dislikeTweet").post(authControl,userTweetDislike)
router.route("/addTask").post(authControl,addTask)
router.route("/getSingleTask/:id").get(authControl,getSingleTask)
router.route("/taskList").get(authControl,getTaskList)
router.route("/deleteTask").post(authControl,deleteTask)
router.route("/taskToTweet").post(authControl,taskToTweet)
router.route("/taskUpdate").post(authControl,updateTask)
router.route("/taskImageUpdate").post(authControl,taskImageUpdate)

module.exports = router