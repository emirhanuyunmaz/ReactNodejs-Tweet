import {useEffect, useState } from "react"
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../store/userApi/userApiSlicer"
import { toast, Zoom } from "react-toastify"
import axios from "axios"
import Cookies from "js-cookie"
import { Eye, EyeOff } from "lucide-react"


export default function Profile(){

    const {data,isFetching,isSuccess,isError} = useGetUserProfileQuery()
    const [updateProfile,responseUpdateProfile] = useUpdateUserProfileMutation()

    const [name,setName] = useState("")
    const [surname , setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [description , setDescription] = useState()
    const [image,setImage] = useState()
    const [newImage,setNewImage] = useState()
    const [changeImage,setChangeImage] = useState(false)
    const [profilePrivate,setProfilePrivate] = useState(false)
    const [passwordControl,setPasswordControl] = useState(true)

    // Metinleri güncelleme sonucu toast mesaj
    const showToastSucces = () => toast.success('Güncelleme Başarılı', {
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

    // Resim güncellem sonucu toast mesaj 
    const showUpdateImageSuccesToast = () => toast.success('Resim Güncelleme Başarılı', {
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

    // Kullanıcı bilgilerinin çekilmesi işlemi.
    function getData(){
        console.log(data);
        setName(data.name)
        setSurname(data.surname)
        setEmail(data.email)
        setPassword(data.password)
        setDescription(data.description)
        setImage(data.image)
        setProfilePrivate(data.profilePrivate)
        // setImageName(data.image)
    }

    // Kullanıcı bilgilerinin güncellenmesi işlemi .
    function updateUserProfile(){
        const bodyData = {
            name:name,
            surname:surname,
            email:email,
            password:password,
            description:description,
            profilePrivate:profilePrivate
        }
        updateProfile(bodyData)
    }

    // Resmin güncellenmesi işlemi.
    async function imageUpdate(event){
        console.log("Resmi güncelleme işlemi yapıldı");
        
        setChangeImage(true)
        
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        
        reader.onload = async () => {
          setNewImage(reader.result)
        }
        
    }

    // Güncellenen resmin backend'e gönderilmesi işlemi.
    async function newImageSend(){
        const token = Cookies.get("accessToken")

        const res = await axios.post("http://localhost:3000/user/updateImage",{
            image:newImage
        },{
            headers:{
                token:token
            }
        })

        if(res.status == 201){
            showUpdateImageSuccesToast()
        }
    }

    useEffect(() => {
        if(newImage){
            newImageSend()            
        }
    },[newImage])


    useEffect(() => {

        if(isSuccess){
            getData()
        }

    },[isSuccess,isFetching,isError])


    useEffect(() => {
        if(responseUpdateProfile.isSuccess){
           
            showToastSucces()
        }
    },[responseUpdateProfile.isSuccess])

    return(
    <div className="flex flex-col md:flex-row gap-5 md:mx-32 mt-16 ">
        <div className="flex flex-col items-center justify-start gap-3 w-full md:w-1/4">
            <img className="rounded-full w-52 md:w-48 md:h-48" src={changeImage ? newImage :`${"http://localhost:3000/"+image}`} alt="" />
            
            <label className="hover:cursor-pointer bg-blue-200 hover:bg-blue-400 hover:text-white px-2 py-1 rounded-xl duration-300 " htmlFor="user_image">
                Change Images
            </label>
            {/* window.location.reload(); */}
            <input className="hidden"  onChange={(e) => imageUpdate(e)} type="file" name="" id="user_image" />
            <div>
                <select value={profilePrivate} onChange={(e) => setProfilePrivate(e.target.value)} className="outline-none border-2 rounded-xl px-2 py-1" name="profileIsSecret" id="">
                    <option value="true">Profil Gizli</option>
                    <option value="false">Profil Açık</option>
                </select>
            </div>
        </div>
        <div className="flex flex-col w-full px-5 md:px-0 mb-5 md:w-2/4">

            <div className="flex w-full flex-col gap-1"> 
                <label className="font-bold ms-3">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="outline-none w-full px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Name"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Surname</label>
                <input value={surname} onChange={(e) => setSurname(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Surname"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Email</label>
                <input disabled value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="email" placeholder="Email"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Password</label>
                <div className="flex px-4 py-2 border-2 mb-5 rounded-xl" >
                    <input value={password} onChange={(e) => setPassword(e.target.value)}  type={`${passwordControl ? "password":"text"}`} placeholder="Password" className="w-full outline-none" />
                    <button onClick={() => setPasswordControl(!passwordControl)} >{passwordControl ? <Eye/> : <EyeOff/>}</button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Description" />
            </div>
            <button onClick={updateUserProfile} className="bg-blue-200 hover:bg-blue-400 hover:text-white px-2 py-2 rounded-xl duration-300" >Update</button>
        </div>
    </div>)
} 