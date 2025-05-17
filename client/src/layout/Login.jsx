import { useEffect, useState } from "react"
import {  useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useUserLoginMutation } from "../store/userApi/userApiSlicer"
import { toast, Zoom } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
export default function Login(){
    const navigate = useNavigate()
    const token = Cookies.get("accessToken")
    // console.log(import.meta.env.VITE_BASE_URL);
    const [loginOnClick,result] = useUserLoginMutation()    
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [passwordControl,setPasswordControl] = useState(true)
    
    
    const showToastError = () => toast.error('Aranan Kullanıcı Bulunamadı', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
    });
    
    async function loginOnSubmit(){
        const r = await loginOnClick({email,password}).unwrap()
        .then((res) => {
            console.log("RES:",res);
            const accessToken = res.accessToken
            const refreshToken = res.refreshToken
            // Tokenlerin kayıt işlemleri.
            Cookies.set("accessToken",accessToken)
            Cookies.set("refreshToken",refreshToken)
            console.log(res.error);
            
            navigate("/tweet",{replace:true})
            window.location.reload()//Sayfa token bilgisi için tekrar yüklenme işlemi yapıldı.

        }).catch((err) => {
            console.log("HATA:",err);
            showToastError()
        })
    }
    
    
    useEffect(() => {
        if(token !== undefined){
            navigate("/tweet")
        }
    },[token])
    
    return(
        <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col mx-5 md:mx-0 w-full md:w-1/3 ">
            <h1 className="text-center text-2xl mb-5">Giriş Yap</h1>
            <div className="outline-none px-4 py-2 border-2 mb-5 rounded-xl"  >
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="outline-none w-full" />
            </div>
            <div className="flex outline-none px-4 py-2 border-2 mb-5 rounded-xl" >
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={`${passwordControl ? "password":"text"}`} placeholder="Şifre" className="outline-none w-full"/>
                <button onClick={() => setPasswordControl(!passwordControl)} >{passwordControl ? <Eye/>: <EyeOff/>}</button>
            </div>
            <a href="/resetPassword" className="mb-3 ms-3 text-blue-400 hover:text-blue-600 duration-300" >Şifemi Unuttum</a>
            <button onClick={loginOnSubmit} className="bg-blue-500 py-2 rounded-xl text-white hover:bg-blue-600 duration-300 mb-5">Giriş Yap</button>
            <a className="w-full text-center text-blue-500 hover:text-blue-700 duration-300" href="/signUp">Üye Ol</a>
        </div>
    </div>)
}