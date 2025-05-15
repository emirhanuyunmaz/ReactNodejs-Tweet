import Cookies from "js-cookie"
import { useContext, useEffect, useState } from "react"
import { userContext } from "../context/userContext"
import "aos/dist/aos.css";
import Aos from "aos"
import { AlignJustify, Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";
import {io} from "socket.io-client"
import { useNotificationShowedMutation, useUserNotificationLengthQuery } from "../store/contactApi/contactApiSlicer";
import { useGetUserProfileQuery } from "../store/userApi/userApiSlicer";
import TweetDialog from "./TweetDialog";
import TaskDialog from "./TaskDialog";

export default function Navbar(){
    const [settingsControl,setSettingsControl] = useState(false)
    const [notificationControl,setNotificationControl] = useState(false)
    const [notificationLength,setNotificationLength] = useState(0)
    const [socket,setSocket] = useState(null)

    const [showTweetDialog,setShowTweetDialog] = useState(false)
    const [showTaskDialog,setShowTaskDialog] = useState(false)

    const getUserNotificationLength = useUserNotificationLengthQuery()
    const [notificationShowed,resNotificationShowed] = useNotificationShowedMutation()
    let {token,logout} = useContext(userContext) 
    const getuserP = useGetUserProfileQuery()
    async function notificationOnClick(){
        if(notificationControl){
            setNotificationControl(false)
            // document.body.style.overflow = "auto"
        }else{
            setNotificationControl(true)
            await notificationShowed()
            getUserNotificationLength.refetch()
            // document.body.style.overflow = "hidden"
        }
    }

    const connectSocket = async () => {
        const token = Cookies.get('accessToken'); // Token'ı async storage'dan al
        
        let s = io('http://localhost:3000/', {query:{token:token}, transports: ['websocket'], reconnection: true });;
        setSocket(s)
        
        // Alıcıya mesaj geldiğinde dinle
        s.on('notification', (notification) => {            
            setNotificationLength(notification.notificationLength)
        });
    }
    
    useEffect(() => {  
            
        connectSocket();
        
        // Bağlantı kesilmeden önce Socket'i temizle
        // return () => {
        //   socket.disconnect();
        // }
    
    },[])

    useEffect(() => {
        if(getUserNotificationLength.isSuccess){
            setNotificationLength(getUserNotificationLength.data.data)
        }
    },[getUserNotificationLength.isSuccess,getUserNotificationLength.isFetching])


    useEffect(() =>{
        Aos.init({
            disable: "phone",
            duration: 300,
            easing: "ease-out-cubic",
          });
    },[])

    return(
    <nav className="bg-blue-500 text-white px-16 md:px-32 py-4 flex items-center justify-between">
        <a className="hidden md:flex font-bold text-2xl" href="/tweet">Tweet</a>
        
        {!token && <a href="/login">Giriş Yap</a>}
        
        {token &&<div>
            <div className="relative flex md:hidden ">
                <button onClick={() => setSettingsControl(!settingsControl)}><AlignJustify /></button>
                <div className={`${!settingsControl && "hidden"} absolute bg-blue-200 text-black px-2 mt-8 ms-[-20px] py-2 rounded-xl z-10 w-[160px]`}>
                    <ul className="flex flex-col gap-2">
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a href={`/tweet`}>Ana Sayfa</a></li>
                        
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a href={`/user/${getuserP?.data?._id}`}>Profil</a></li>

                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a onClick={() => setShowTweetDialog(true)}>Tweet At</a></li>

                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><button onClick={() => setShowTaskDialog(true)}>Taslaklar</button></li>

                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a href="/message">Mesaj</a></li>

                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a href="/profile">Ayarlar</a></li>
                        
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300" ><button onClick={logout}>Çıkış Yap</button></li>
                    </ul>
                </div>
            </div>
        </div>}
        {settingsControl && <div onClick={() => {setSettingsControl(false)}}  className="bg-opacity-0 z-0 fixed inset-0  w-screen h-screen"></div>}
        
        {token && <div className={`ms-auto"`}>
            <button onClick={notificationOnClick} className="hover:text-gray-300 relative">
                <Bell />
                <span className="absolute -top-3 -right-3 ">
                    {notificationLength}
                </span>
            </button>

            {notificationControl && <div>
                <NotificationCard notificationLength={notificationLength} />
                <div onClick={notificationOnClick} className=" opacity-0 fixed inset-0 z-40"></div>
            </div>
            }
        </div>}
        <div className="absolute" >
            <TweetDialog setShowModal={setShowTweetDialog} showModal={showTweetDialog}/>
            <TaskDialog setShowModal={setShowTaskDialog} showModal={showTaskDialog} />
        </div>
    </nav>)
}