import axios from "axios"
import { Camera, CameraIcon, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form";
import ReactImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import { getBase64 } from "../utils/imageProcess";


export default function Signup(){

    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [isImage,setIsImage] = useState(false)
    const [image,setImage] = useState(undefined)
    const [passwordControl,setPasswordControl] = useState(true)
    const [passwordAgainControl,setPasswordAgainControl] = useState(true)

    const maxNumber = 1;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImage(imageList);
  };

    const showToastSucces = () => toast.success('Kayıt Başarılı', {
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
    
    const showToastError = () => toast.error('Bir hata ile karşılaşıldı', {
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

        const onSubmit = async (data)=> {
            try{
                const newData = {
                ...data,
                image:image
                }
                console.log(newData);
                
                const res =await axios.post("http://localhost:3000/signup",newData)

                if(res.status === 201){
                    showToastSucces()
                    navigate("/login")
                }
            }catch(err){
                console.log("ERR:",err);
                showToastError()
            }
        };

        async function uploadImage(e) {
            const file = e.target.files[0]
            const image = await getBase64(file)
            setIsImage(true)
            setImage(image)
        } 

        function deleteImage(){
            setImage(undefined)
            setIsImage(false)
        }
    return(
    <div className="flex w-full md:min-h-[90vh] justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full mx-5 md:mx-0 sm:w-1/2 md:w-1/3">
            <div className="flex gap-5 mb-5 mt-5">
            
            <div >
                {/* Resim yükleme */}
                <label htmlFor="imageUpload" className="w-full  md:w-40 h-40 flex justify-center items-center border-2 cursor-pointer">
                {image == undefined ? <CameraIcon color="black" />: <img src={`${image}`} className="w-full h-full" />}
                </label>
                {image != undefined && <div className="w-40 text-center">
                <button onClick={deleteImage} className="border-2 border-red-500 hover:opacity-80 px-4 py-1 rounded-xl mx-auto">Delete</button>
                </div>}
                <input onChange={(e) => uploadImage(e)} hidden id="imageUpload" type="file" />
            </div>
        
            
                
            </div>
            <div className="flex flex-col gap-1 mb-5">
                <label className="font-bold ms-3" >Ad</label>
                <input className="outline-none px-4 py-2 border-2 rounded-xl" type="text" placeholder="Ad" {...register("name", { required:"Lütfen bir ad giriniz." })} />
                {errors.name && <p className="text-red-600 ms-3 text-sm" >{errors.name.message}</p>}

            </div>
            <div className="flex flex-col gap-1 mb-5">
                <label className="font-bold ms-3">Soyad</label>
                <input className="outline-none px-4 py-2 border-2 rounded-xl" type="text" placeholder="Soyad"
                {...register("surname", { required:"Lütfen bir soyad giriniz." })} />
                {errors.surname && <p className="text-red-600 ms-3 text-sm" >{errors.surname.message}</p>}
            </div>
            <div className="flex flex-col gap-1 mb-5">
                <label className="font-bold ms-3">Email</label>
                <input className="outline-none px-4 py-2 border-2  rounded-xl" type="email" placeholder="Email" {...register("email", { required:"Lütfen bir email giriniz." })} />
                {errors.email && <p className="text-red-600 ms-3 text-sm" >{errors.email.message}</p>}

            </div>
            <div className="flex flex-col gap-1 mb-5">
                <label className="font-bold ms-3">Parola</label>
                <div className="flex outline-none px-4 py-2 border-2 rounded-xl"  >
                    <input type={`${passwordControl ?"password" : "text"}`} placeholder="Parola" className="w-full outline-none" {...register("password", { required:"Lütfen bir parola giriniz." })} />
                    <button onClick={(e) =>{e.preventDefault(); setPasswordControl(!passwordControl)}} >{passwordControl ? <Eye/> : <EyeOff/>}</button>
                </div>
                {errors.password && <p className="text-red-600 ms-3 text-sm" >{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-1 mb-5">
                <label className="font-bold ms-3">Parola Tekrar</label>
                <div className="flex outline-none px-4 py-2 border-2  rounded-xl" >
                    <input type={`${passwordAgainControl ? "password":"text"}`} placeholder="Parola Tekrar" className="outline-none w-full" {...register("passwordAgain", { required:"Lütfen bir parola tekrar giriniz." ,validate: (val) => {
                        if (watch('password') != val) {
                            return "Şifreler eşleşmiyor";
                        }}})} />
                    <button onClick={(e) => {e.preventDefault();setPasswordAgainControl(!passwordAgainControl)}} >{passwordAgainControl ? <Eye/> : <EyeOff/>}</button>
                </div>
                {errors.passwordAgain && <p className="text-red-600 ms-3 text-sm" >{errors.passwordAgain.message}</p>}
            </div>
            <div className="flex flex-col gap-1 mb-5">
                <label className="font-bold ms-3">Açıklama</label>
                <textarea className="outline-none px-4 py-2 border-2  rounded-xl" type="password" placeholder="Açıklama" {...register("description", { required:"Lütfen bir açıklama giriniz." })} />
                {errors.description && <p className="text-red-600 ms-3 text-sm" >{errors.description.message}</p>}

            </div>
            <button type="submit" className="bg-blue-500 py-2 rounded-xl text-white hover:bg-blue-600 duration-300 mb-5">Kayıt Ol</button>
        </form>
    </div>)
}