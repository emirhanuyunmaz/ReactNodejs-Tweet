import { useEffect, useState } from "react"
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../store/userApi/userApiSlicer"
import { toast, Zoom } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Profile(){
    const navigate = useNavigate()
    const {data,isFetching,isSuccess,isError} = useGetUserProfileQuery()
    const [updateProfile,responseUpdateProfile] = useUpdateUserProfileMutation()
    const [name,setName] = useState("")
    const [surname , setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [description , setDescription] = useState()
    const [image,setImage] = useState()
    const [imageName,setImageName] = useState("")
    const [changeImage,setChangeImage] = useState(false)
    
    /**
    * profil gizli mi açık mı ? eklenecek
    * 
    * 
    */

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

    function getData(){
        console.log(data);
        setName(data.name)
        setSurname(data.surname)
        setEmail(data.email)
        setPassword(data.password)
        setDescription(data.description)
        setImage(data.image)
        setImageName(data.image)
    }

    function updateUserProfile(){
        const bodyData = {
            name:name,
            surname:surname,
            email:email,
            password:password,
            description:description,

        }
        updateProfile(bodyData)
    }

    async function imageUpdate(e){
        setImageName(image)
        setChangeImage(true)
        const formData = new FormData()
        formData.append('image',e.target.files[0])      
        
          
        formData.append('imageName',imageName)
        
        const config = {headers: {'Content-Type': 'multipart/form-data',"imageName":imageName}}

        const res =await axios.post("http://localhost:3000/user/updateImage",formData,config)
        
    }

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
    <div className="flex flex-col md:flex-row gap-5 mx-32 mt-16 ">
        <div className="flex flex-col items-center justify-start gap-3 md:w-1/4">
            <img className="rounded-full" src={`http://localhost:3000/user/profile/image/${image}`} alt="" />
            <label className="hover:cursor-pointer bg-blue-200 hover:bg-blue-400 hover:text-white px-2 py-1 rounded-xl duration-300 " htmlFor="user_image">
                Change Images
            </label>
            <input className="hidden"  onChange={(e) => {imageUpdate(e);window.location.reload();}} type="file" name="" id="user_image" />
        </div>
        <div className="flex flex-col md:w-2/4">
            <input value={name} onChange={(e) => setName(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Name"/>
            <input value={surname} onChange={(e) => setSurname(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Surname"/>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="email" placeholder="Email"/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Password" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Description" />
            <button onClick={updateUserProfile} className="bg-blue-200 hover:bg-blue-400 hover:text-white px-2 py-2 rounded-xl duration-300" >Update</button>
        </div>
    </div>)
} 