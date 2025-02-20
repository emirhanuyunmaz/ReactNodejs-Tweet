import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import {io} from "socket.io-client"
import { useGetUserAllMessageQuery } from "../../store/messageApi/messageApiSlicer";

const messageContext = createContext()

function MessageProvider({children}){
    const baseUrl = process.env.BASE_URL

    
    const [socket,setSocket] = useState(null)
    const [messageList,setMessageList] = useState([])

    const connectSocket = async (id) => {
        const token = await AsyncStorage.getItem("access_token")
        // const id = await AsyncStorage.getItem("message_user_id")
        // console.log("CONNECTED MESSAGE SOCKET CONTEXT:",id);
        

        let s = io(baseUrl+"/", {query:{token:token,userId:id}, transports: ['websocket'], reconnection: true });;
        setSocket(s)
        
        // Alıcıya mesaj geldiğinde dinle
        s.on('receiveMessage', (newMessage) => {
            console.log("NEW MESSAGE::",newMessage);
            setMessageList((prevMessages) => [...prevMessages, newMessage]);
          
        });
    }

    async function SendMessage(messageText,id){
        if(socket !== null){
        const token = await AsyncStorage.getItem("access_token")
            // Sunucuya mesaj gönderme olayı
          try{
            // console.log("MESAJ GİTTİ:",token);
            socket.emit('sendMessage', {text:messageText,token:token ,getUserId:id,isImage:false})

          }catch(err){
            console.log("EEEE::",err);
            // Toast message:
          }
        }else{
          console.log("NOTSOCKET:::::");
        }
      }

    async function SendImageMessage(image,id){
        const token = await AsyncStorage.getItem("access_token")
        socket.emit('sendMessage', {text:image,token:token ,getUserId:id,isImage:true})

    }

    

    // useEffect(() => {  
        
    //     connectSocket();
        
    //     // Bağlantı kesilmeden önce Socket'i temizle
    //     // return () => {
    //     //   socket.disconnect();
    //     // }
  
    //   },[])


    return (<messageContext.Provider value={{SendMessage,messageList,setMessageList,connectSocket,SendImageMessage}} >
        {children}
    </messageContext.Provider>)
}

export{
    messageContext,MessageProvider
}