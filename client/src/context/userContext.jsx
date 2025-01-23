import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {io} from "socket.io-client"

const userContext = createContext() 

function UserContextProvider({children}){
    const [socket,setSocket] = useState(null)

    let token = Cookies.get("accessToken")
    let refreshToken = Cookies.get("refreshToken")
    function logout(){
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        window.location.reload()
    }

    const connectSocket = async () => {
        const token = Cookies.get('accessToken'); // Token'ı async storage'dan al
        
        let s = io('http://localhost:3000/', {query:{token:token}, transports: ['websocket'], reconnection: true });;
        setSocket(s)
    }

    async function tweetFollowSocket(tweet,process){

        if(socket !== null){
            console.log("SSSSS:::");
            
            const token = Cookies.get("accessToken")
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

    async function tweetUnfollowSocket(tweet,process){

        if(socket !== null){            
            const token = Cookies.get("accessToken")
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

    useEffect(() => {
        connectSocket()
    },[])


    return(<userContext.Provider value={{token,refreshToken,logout,tweetFollowSocket,tweetUnfollowSocket}} >{children}</userContext.Provider>)
}


export {
    UserContextProvider,userContext
}