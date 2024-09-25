import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export default function Navbar(){

    const [settingsControl,setSettingsControl] = useState(false)

    let token = Cookies.get("accessToken")
    useEffect(()=> {
        token = Cookies.get("accessToken")
    },)

    return(
    <nav className="bg-blue-500 text-white px-16 md:px-32 py-4 flex items-center justify-between">
        <a className="font-bold text-2xl" href="/tweet">Tweet</a>
        
        <div>
            {!token && <a href="/login">Login</a>}
            {token && <div className="relative flex ">
                <button onClick={() => setSettingsControl(!settingsControl)}>More</button>
                <div className={`${!settingsControl && "hidden"} absolute bg-blue-200 text-black px-2 mt-8 ms-[-20px] py-2 rounded-xl z-10`}>
                    <ul className="flex flex-col gap-2">
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300"><a href="/profile">Profile</a></li>
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300" ><a href="/settings">Settings</a></li>
                        <li className="hover:bg-blue-400 px-8 py-1 rounded-xl hover:shadow-xl duration-300" ><a href="/logout">Logout</a></li>
                    </ul>
                </div>
            </div>}
        </div>
        {settingsControl && <div onClick={(e) => {setSettingsControl(false)}}  className="bg-opacity-0 z-0 fixed inset-0  w-screen h-screen"></div>}
    </nav>)
}