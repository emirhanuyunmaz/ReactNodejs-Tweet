import axios from "axios"
import { useState } from "react"
import {  useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
export default function Login(){
    const navigate = useNavigate()

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    async function loginOnSubmit(){
        const res = await axios.post("http://localhost:3000/login",{
            email:email,
            password:password
        }) 
        console.log("YANIT:",res);
        if(res.status === 200){
            console.log("Giriş işlemi...:");
            console.log("ACCES TOKEN:",res.data.accessToken);
            console.log("REFRESH TOKEN:",res.data.refreshToken);
            
            const accesToken = res.data.accessToken
            Cookies.set("accessToken",accesToken)

            const refreshToken = res.data.refreshToken
            Cookies.set("refreshToken",refreshToken)

            navigate("/tweet")
        }
    }

    return(
    <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col mx-5 md:mx-0 w-full md:w-1/3 ">
            <h1 className="text-center text-2xl mb-5">Login</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="email" placeholder="Email"/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Password" />
            <button onClick={loginOnSubmit} className="bg-blue-500 py-2 rounded-xl text-white hover:bg-blue-600 duration-300 mb-5">Login</button>
            <a className="w-full text-center text-blue-500 hover:text-blue-700 duration-300" href="/signUp">Sign Up</a>
        </div>
    </div>)
}