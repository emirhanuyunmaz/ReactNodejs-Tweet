import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function Profile(){
    const [name,setName] = useState("")
    const [surname , setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [description , setDescription] = useState()
    const [image,setImage] = useState()

    const token = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")
    
    async function getUserProfile(){
        const res = await axios.get(`http://localhost:3000/user/profile/`,
            {
                headers:{
                    refreshtoken:refreshToken,
                    token:token
                }
            }
        )
        if(res.status === 200){
            setName(res.data.name)
            setSurname(res.data.surname)
            setEmail(res.data.email)
            setPassword(res.data.password)
            setDescription(res.data.description)
            setImage(res.data.image)
            
        }

        console.log("KULLANICI BİLGİLERİ :",res);
        
    }
    

    useEffect(()=> {
        // console.log("USER Profile : Token : ",token);
        // console.log("USER Profile : Refresh-Token : ",refreshToken);
        getUserProfile()
    },[])


    return(
    <div className="flex flex-col md:flex-row gap-5 mx-32 mt-16 ">
        <div className="flex flex-col items-center justify-start gap-3 md:w-1/4">
            <img className="rounded-full" src={`http://localhost:3000/user/profile/image/${image}`} alt="" />
            <button className="bg-blue-200 hover:bg-blue-400 hover:text-white px-2 py-1 rounded-xl duration-300">Change Images</button>
        </div>
        <div className="flex flex-col md:w-2/4">
            <input value={name} onChange={(e) => setName(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Name"/>
            <input value={surname} onChange={(e) => setSurname(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Surname"/>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="email" placeholder="Email"/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Password" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Description" />
            <button className="bg-blue-200 hover:bg-blue-400 hover:text-white px-2 py-2 rounded-xl duration-300" >Update</button>
        </div>
    </div>)
} 