import { createContext } from "react";


const authContext = createContext()

function AuthProvider({children}){

    function Login(){
        
    }

    return (<authContext.Provider value={{}} >
        {children}
    </authContext.Provider>)
}