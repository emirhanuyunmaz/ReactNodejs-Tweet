import Cookies from "js-cookie"
import { useContext, useEffect, useState } from "react"
import { userContext } from "../context/userContext"
import "aos/dist/aos.css";
import Aos from "aos"
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";

export default function Navbar(){
    const [settingsControl,setSettingsControl] = useState(false)
    const [searchControl,setSearchControl] = useState(false)
    const [notificationControl,setNotificationControl] = useState(false)
    let {token,logout} = useContext(userContext) 
    // console.log("Context Token :",token);
    function notificationOnClick(){
        if(notificationControl){
            setNotificationControl(false)
            document.body.style.overflow = "auto"
        }else{
            setNotificationControl(true)
            document.body.style.overflow = "hidden"
        }
    }
    

    useEffect(() =>{
        Aos.init({
            disable: "phone",
            duration: 200,
            easing: "ease-out-cubic",
          });
    },[])

    return(
    <nav className="bg-blue-500 text-white px-16 md:px-32 py-4 flex items-center justify-between">
        <a className="font-bold text-2xl" href="/tweet">Tweet</a>
        
        {token && !searchControl &&<div>
            <button onClick={ () => {setSearchControl(true); document.body.style.overflow = "hidden" } } className="border-2  hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300" >Kullanıcı Ara</button>
        </div>}
        {!token && <a href="/login">Login</a>}
        
        {/* LEFT BAR EKLENCEK */}
        {/* {token &&<div>
            <div className="relative flex md:hidden ">
                <button onClick={() => setSettingsControl(!settingsControl)}>More</button>
                <div className={`${!settingsControl && "hidden"} absolute bg-blue-200 text-black px-2 mt-8 ms-[-20px] py-2 rounded-xl z-10`}>
                    <ul className="flex flex-col gap-2">
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a href="/profile">Profile</a></li>
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300" ><a href="/settings">Settings</a></li>
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300" ><button onClick={logout}>Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>} */}
        {settingsControl && <div onClick={() => {setSettingsControl(false)}}  className="bg-opacity-0 z-0 fixed inset-0  w-screen h-screen"></div>}
        
        {token && <div className={`${searchControl && "ms-auto"}`}>
            <button onClick={notificationOnClick} className="hover:text-gray-300">
                <Bell />
            </button>

            {/* Kullanıcı bildirim componenti */}
            {notificationControl && <>
                <NotificationCard/>
                <div onClick={notificationOnClick} className=" opacity-0 fixed inset-0 z-40"></div>
            </>
            }
        </div>}

        
            
        {searchControl && <div>
            <div data-aos="fade-down" className="mt-16 h-16 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-blue-500">
                <input  className="w-1/4 outline-none px-4 py-2 border-2 text-black rounded-xl" type="text" placeholder="Kullanıcı Adı"/>
            </div>
            <div onClick={() => {setSearchControl(false);document.body.style.overflow = "auto"}} className="mt-16 opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>}
        

    </nav>)
}