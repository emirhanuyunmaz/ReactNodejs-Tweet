import Cookies from "js-cookie"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({children}){
    const token = Cookies.get("accessToken")
    const navigate = useNavigate()

    console.log("KULLANICI TOKEN BİLGİSİ:",token);
    useEffect(() => {
        if(!token){
            console.log("Token bilgisi yok")    
            navigate("/login")
        }
    },[])
    return(children)
}