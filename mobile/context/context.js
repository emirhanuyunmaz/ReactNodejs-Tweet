import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import {io} from "socket.io-client"

const context = createContext()

function ContextProvider({children}){
    const baseUrl = process.env.BASE_URL

    const [socket,setSocket] = useState(null)
    const [messageList,setMessageList] = useState([])
    const [notificationLength,setNotificationLength] = useState(0)
    let s
    const connectSocket = async () => {
        const token = await AsyncStorage.getItem("access_token")
        
        s = io(baseUrl+"/", {query:{token:token}, transports: ['websocket'], reconnection: true });;
        setSocket(s)
        
        s.on('notification', (notification) => {   
            console.log("NOTIF::",notification);
            setNotificationLength(notification.notificationLength)
        });
    }

  async function tweetLikeSocket(tweet,process){

      if(socket !== null){
          console.log("SSSSS:::");
          
          const token = await AsyncStorage.getItem("access_token")
          // Sunucuya bildirim gönderme olayı
          try{
              socket.emit('notification', {tweet:tweet,token:token,process})
          
          }catch(err){
              console.log("EEEE::",err);
          // Toast message:
          }
      }else{
          console.log("NOTSOCKET:::::");
      }
  }

    // Socket ile beğeni çekme işleminde bildirimi silme işlemi
    async function tweetUnlikeSocket(tweet,process){

      if(socket !== null){            
        const token = await AsyncStorage.getItem("access_token")
        // Sunucuya bildirim gönderme olayı
          try{
          socket.emit('notification', {tweet:tweet,token:token,process})
          
          }catch(err){
              console.log("EEEE::",err);
          // Toast message:
          }
      }else{
          console.log("NOTSOCKET:::::");
      }
  }

      // Yorum bildirim ekleme işlemi.
      async function tweetCommentSocket(tweet,process){

        if(socket !== null){            
          const token = await AsyncStorage.getItem("access_token")
          // Sunucuya bildirim gönderme olayı
            try{
            socket.emit('notification', {tweet:tweet,token:token,process})
            
            }catch(err){
                console.log("EEEE::",err);
            // Toast message:
            }
        }else{
            console.log("NOTSOCKET:::::");
        }
    }

        // Kullaıcı takip isteği atma işlemi.
      async function userFollowSocket(userId,process){

        if(socket !== null){            
          const token = await AsyncStorage.getItem("access_token")
            // Sunucuya bildirim gönderme olayı
            try{
            socket.emit('notification', {userId:userId,token:token,process})
            
            }catch(err){
                console.log("EEEE::",err);
            // Toast message:
            }
        }else{
            console.log("NOTSOCKET:::::");
        }
    }
        // Kullaıcı takip etme işlemi.
      async function userDirectFollowSocket(userId,process){
        console.log("AA::NOT SO");
        
        if(socket !== null){            
            console.log("TAKİP ETME İŞLEMİ");
            
          const token = await AsyncStorage.getItem("access_token")
            // Sunucuya bildirim gönderme olayı
            try{
            socket.emit('notification', {userId:userId,token:token,process})
            
            }catch(err){
                console.log("EEEE::",err);
            // Toast message:
            }
        }else{
            console.log("NOTSOCKET:::::");
        }
    }

        // Kullaıcı takip isteğini geri çekme işlemi.
    async function userUnfollowSocket(userId,process){

          if(socket !== null){            
            const token = await AsyncStorage.getItem("access_token")
              // Sunucuya bildirim gönderme olayı
              try{
                  socket.emit('notification', {userId:userId,token:token,process})
              
              }catch(err){
                  console.log("EEEE::",err);
              // Toast message:
              }
          }else{
              console.log("NOTSOCKET:::::");
          }
      }

    function DisconnectSocket(){
        
        if(socket != null){
            socket.disconnect();
        }
    }    

    useEffect(() => {  
        
        connectSocket();
        
        // Bağlantı kesilmeden önce Socket'i temizle
        return () => {
          DisconnectSocket()
        }
  
      },[])


    return (<context.Provider value={{tweetLikeSocket,tweetUnlikeSocket,tweetCommentSocket,userFollowSocket,userUnfollowSocket,notificationLength,setNotificationLength,userDirectFollowSocket}} >
        {children}
    </context.Provider>)
}

export{
  context,ContextProvider
}