import { createContext } from "react";
import Cookies from "js-cookie";

const userContext = createContext() 

function UserContextProvider({children}){

    let token = Cookies.get("accessToken")
    let refreshToken = Cookies.get("refreshToken")




    return(<userContext.Provider value={{token,refreshToken}} >{children}</userContext.Provider>)
}


export {
    UserContextProvider,userContext
}