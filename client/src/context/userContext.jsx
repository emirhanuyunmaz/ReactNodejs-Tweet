import { createContext } from "react";
import Cookies from "js-cookie";

const userContext = createContext() 

function UserContextProvider({children}){

    let token = Cookies.get("accessToken")
    let refreshToken = Cookies.get("refreshToken")
    function logout(){
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        window.location.reload()
    }



    return(<userContext.Provider value={{token,refreshToken,logout}} >{children}</userContext.Provider>)
}


export {
    UserContextProvider,userContext
}