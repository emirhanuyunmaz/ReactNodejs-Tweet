const app = require("./routes")
const http = require("http")
const {Server} = require("socket.io")
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",// React uygulamanın çalıştığı adres
        methods:["GET","POST","DELETE"]
    }
})
global.io = io

const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const { MessageModel } = require("./message/model")
const {UserNotificationModel} = require("./contact/model")
const uuid = require("uuid")
const fs = require("fs")
async function main(){
    try{

        mongoose.connect('mongodb://127.0.0.1:27017/tweet').then(() => console.log('Connected! MongoDB'));

        io.use((socket, next) => {
            const token = socket.handshake.query.token;
            const userId = socket.handshake.query.userId
            // console.log("LDLDLDLLDLDLL");
            
            if (token) {
              jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    // console.log("SSSS:S::S:S:S:S:S:",err);
                    
                  return next(new Error('Authentication error'));
                }
                // console.log("DDD::",decoded.id);
                socket.recipientId = userId
                // console.log("USERID:",userId);
                
                socket.user = decoded; // Token'dan kullanıcı bilgilerini al        
                next();
            });
        } 
        });

        // console.log("SOCKETIO");
                
        // Socket io ile veri dinleme işlemi .
        io.on("connection", (socket) => {
            socket.join(socket.user.id)
            // console.log("KULLANİCİ::",socket.user.id);
            
            // console.log("::SOCKETIIIIÇ:");
            // Mesaj Gönderme Ve Alma İşlemi
            socket.on('sendMessage' ,async (messageData) => {
                try{
                    console.log("MESSAGE:",messageData);
                    
                    const decoded = jwt.decode(messageData.token,process.env.TOKEN_SECRET)            
                    let newMessage ;
                    
                    if(!messageData.isImage){
                        // Kullanıcı mesaj gönderdiği zaman sunucunun mesajı kaydetme ve kullnıcılara göndermesi işlemi.
                        
                        newMessage = new MessageModel({message:messageData.text,senderUserId:decoded.id,recipientUserId:messageData.getUserId,isImage:messageData.isImage})
                        await newMessage.save()
                        io.to(socket.recipientId).emit("receiveMessage",newMessage)
                    }else{
                        console.log("messageData.isImage::",messageData.isImage);
                        
                        const imageName = uuid.v4()
                        const filePath = `uploads/${imageName}.png`
                        
                        fs.writeFile( __dirname + "/" + filePath , messageData.text.split(";base64,").pop(), {encoding: 'base64'}, function(err) {
                            console.log('File created');
                        });
                        newMessage = new MessageModel({message:filePath,senderUserId:decoded.id,recipientUserId:messageData.getUserId,isImage:messageData.isImage})
                        await newMessage.save()
                        io.to(socket.recipientId).emit("receiveMessage",newMessage)
                    }
                    // io.to(socket.recipientId).emit("receiveMessage",newMessage)
                }catch(err){
                    console.log("Bir hata socket io:",err);
                }
            })

            // ******************Bildirim Alma işlemi******************* //
            socket.on("notification",async (notification) => {
                // notification ile gelen userId bilgisi bildirim gönderilercek kullanıcıyı belirler.
                try{

                    // console.log("A:",notification);
                    
                    // Takip isteği atma işlemi.
                    if(notification.process=="follow" && (socket.user.id != notification.userId)  ){
                        console.log("Takip isteği İŞLEMİ:::::",notification);
                        const newNotification = new UserNotificationModel({
                            userId:notification.userId,
                            process:notification.process,
                            transactionUser:socket.user.id
                        })
                        await newNotification.save()
                        const notificationLength = await UserNotificationModel.find({userId:notification.userId,isShowed:false})
                        io.to(notification.userId).emit("notification",{notificationLength:notificationLength.length})
                    }

                    // Takip isteğini geri çekme işlemi.
                    if(notification.process=="unfollow" && (socket.user.id != notification.userId)  ){
                        console.log("Takip isteği Çekme İŞLEMİ:::::",notification);
                        await UserNotificationModel.findOneAndDelete({userId:notification.userId,
                            transactionUser:socket.user.id,
                            process:"follow",
                            })
                        const notificationLength = await UserNotificationModel.find({userId:notification.tweet.userId._id,isShowed:false})
                        io.to(notification.tweet.userId._id).emit("notification",{notificationLength:notificationLength.length})
                    }

                    //Burada başka kullanıcıdan gelen bildirimler sayısı verilecek ve görülmeyenler için     
                    if(notification.process=="like" && (socket.user.id != notification.tweet.userId._id)  ){
                        console.log("Başka bir kullanıcı .");
                        const newNotification = new UserNotificationModel({
                            postId:notification.tweet._id,
                            userId:notification.tweet.userId._id,
                            process:notification.process,
                            transactionUser:socket.user.id
                        })
                        await newNotification.save()
                        const notificationLength = await UserNotificationModel.find({userId:notification.tweet.userId._id,isShowed:false})
                        io.to(notification.tweet.userId._id).emit("notification",{notificationLength:notificationLength.length})                        
                    }
                    // else{
                    //     console.log("Kendi hesabı");
                    // }
                    // Tweet beğeni işlemini geri alma işlemi.
                    if(notification.process=="unlike" && (socket.user.id != notification.tweet.userId._id)  ){
                        console.log("BEĞENİ ÇEKME İŞLEMİ:::::");
                        await UserNotificationModel.findOneAndDelete({userId:notification.tweet.userId._id,
                        transactionUser:socket.user.id,
                        process:"like",
                        postId:notification.tweet._id
                        })
                        const notificationLength = await UserNotificationModel.find({userId:notification.tweet.userId._id,isShowed:false})
                        io.to(notification.tweet.userId._id).emit("notification",{notificationLength:notificationLength.length})
                    }

                    // Tweet yorum yapma işlemi.
                    if(notification.process=="tweetComment" && (socket.user.id != notification.tweet.userId._id)){
                        console.log("Yorum yapma İŞLEMİ:::::",notification);
                        const newNotification = new UserNotificationModel({
                            postId:notification.tweet._id,
                            userId:notification.tweet.userId._id,
                            process:notification.process,
                            transactionUser:socket.user.id
                        })
                        await newNotification.save()
                        const notificationLength = await UserNotificationModel.find({userId:notification.tweet.userId._id,isShowed:false})
                        io.to(notification.tweet.userId._id).emit("notification",{notificationLength:notificationLength.length})
                    }

                    
                }catch(err) {
                    console.log("Bildirim işlemi yapılırken bir hata ile karşılaşıldı.",err);
                    
                }
            }) 
            socket.on('connect_error', (err) => {
                console.log('Connection Error:', err); // Bağlantı hatasını logla
            });
            
            socket.on('error', (err) => {
                console.log('Socket Error:', err); // Socket hatalarını logla
            });

            socket.on("disconnect" , () =>{
                console.log("Bir kullanıcı ayrıldı.",socket.id);
            })

        })

        const PORT = process.env.PORT || 3000
        server.listen(PORT,() =>{
            console.log(`BASE URL : ${process.env.BASE_URL}`);
            console.log(`Listening port ${PORT}`);
        })
    }catch(err){
        console.log("ERR:",err);
    }
}

main()