import axios from "axios"
import { Camera, RefreshCw, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";


export default function Signup(){

    const navigate = useNavigate()

    const [name,setName] = useState("")
    const [surname , setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [passwordAgain,setPasswordAgain] = useState("")
    const [description , setDescription] = useState()
    const [image,setImage] = useState()

    
    async function signupUser(){        
        const formData = new FormData()
        formData.append('image',image)
        formData.append('name',name)
        formData.append('surname',surname)
        formData.append('email',email)
        formData.append('password',password)
        formData.append('description',description)
        console.log("FORMDATA:",formData);
        
        const config = {headers: {'Content-Type': 'multipart/form-data'}}

        const res =await axios.post("http://localhost:3000/signup",formData,config)
        console.log(res)
        if(res.status === 201){
            navigate("/login")
        }
        
    }

    return(
    <div className="flex w-full md:min-h-[90vh] justify-center items-center">
        <div className="flex flex-col w-full mx-5 md:mx-0 md:w-1/3">
            <div className="flex gap-5 mb-5 ">
            <label className="hover:cursor-pointer " htmlFor="user_image">
            <div className="w-36 h-36 flex items-center justify-center border-2">
                        {
                            image === undefined ? <Camera /> : <img className="w-full h-full"  src={URL.createObjectURL(image)} alt="" /> 
                        }
                </div>
                </label>
            <input className="hidden" onChange={(e) => {console.log("RR:",e.target.files[0]);setImage(e.target.files[0]);}} type="file" name="" id="user_image" />
                <div className="flex items-end pt-10">
                    <button ></button>
                </div>
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Name"/>
            <input value={surname} onChange={(e) => setSurname(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Surname"/>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="email" placeholder="Email"/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Password" />
            <input value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Password Again" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Description" />
            <button onClick={signupUser} className="bg-blue-500 py-2 rounded-xl text-white hover:bg-blue-600 duration-300 mb-5">Sign Up</button>
        </div>
    </div>)
}