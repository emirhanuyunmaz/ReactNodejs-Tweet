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
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const { MessageModel } = require("./message/model")
const uuid = require("uuid")
const fs = require("fs")
async function main(){
    try{

        mongoose.connect('mongodb://127.0.0.1:27017/tweet').then(() => console.log('Connected!'));

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

        
        // Socket io ile veri dinleme işlemi .
        io.on("connection", (socket) => {
            socket.join(socket.user.id)
            console.log("KULLANİCİ::",socket.user.id);
            

            socket.on('sendMessage' ,async (messageData) => {
                try{

                    // isImage => bu veriye göre kaydetme işlemi yapılacak.
                    console.log("SOCKET:",socket.recipientId);
                    console.log("RESİMMİ::",messageData.isImage);
                    const decoded = jwt.decode(messageData.token,process.env.TOKEN_SECRET)            

                    if(!messageData.isImage){
                        // Kullanıcı mesaj gönderdiği zaman sunucunun mesajı kaydetme ve kullnıcılara göndermesi işlemi.
                        
                        const newMessage = new MessageModel({message:messageData.text,senderUserId:decoded.id,recipientUserId:messageData.getUserId,isImage:messageData.isImage})
                        await newMessage.save()
                        console.log("RERERER::",messageData.getUserId);
                        
                        io.to(socket.recipientId).emit("receiveMessage",newMessage)
                    }else{
                        const imageName = uuid.v4()
                        const filePath = __dirname + `/uploads/${imageName}.png`
                        console.log("File Path:",filePath);
                        
                        fs.writeFile(filePath , messageData.text.split(";base64,").pop(), {encoding: 'base64'}, function(err) {
                            console.log('File created');
                        });
                        const newMessage = new MessageModel({message:imageName+".png",senderUserId:decoded.id,recipientUserId:messageData.getUserId,isImage:messageData.isImage})
                        await newMessage.save()
                        io.to(socket.recipientId).emit("receiveMessage",newMessage)
                    }
                    // io.to(socket.user.id).emit("receiveMessage",newMessage)
                }catch(err){
                    console.log("Bir hata socket io:",err);
                    
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

        
        server.listen(3000,() =>{
            console.log("Listening port 3000");
        })
    }catch(err){
        console.log("ERR:",err);
    }
}

main()