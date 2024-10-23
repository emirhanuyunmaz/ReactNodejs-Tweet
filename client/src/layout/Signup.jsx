import axios from "axios"
import { Camera, RefreshCw, Trash2 } from "lucide-react"
import { useState } from "react"
import ReactImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";


export default function Signup(){

    const navigate = useNavigate()

    const [name,setName] = useState("")
    const [surname , setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [passwordAgain,setPasswordAgain] = useState("")
    const [description , setDescription] = useState()
    const [image,setImage] = useState([])

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

    
    async function signupUser(){        

        // console.log("İMAGE:::",image[0].data_url);
        
        const res =await axios.post("http://localhost:3000/signup",{
            name:name,
            surname:surname,
            email:email,
            password:password,
            description:description,
            image:image[0].data_url
        })
        console.log(res)
        if(res.status === 201){
            showToastSucces()
            navigate("/login")
        }
        
    }

    return(
    <div className="flex w-full md:min-h-[90vh] justify-center items-center">
        <div className="flex flex-col w-full mx-5 md:mx-0 sm:w-1/2 md:w-1/3">
            <div className="flex gap-5 mb-5 ">
            {/* Resim ekleme yapan label */}
            <label className="hover:cursor-pointer " htmlFor="user_image">
            <div className="mt-10">
                {/* Resim yükleme için gereken kütüphane */}
            <ReactImageUploading
                multiple
                value={image}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                }) => (
                // write your building UI
                <div className="upload__image-wrapper w-40 h-40 flex items-center justify-center border-2">
                    <button
                    className="flex justify-center items-center"
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                    >
                    {image.length === 0 &&<Camera/>}
                    </button>
                    &nbsp;
                    <button onClick={onImageRemoveAll}></button>
                    {imageList.map((img, index) => (
                    <div key={index} className="image-item flex flex-col gap-2">
                        <img src={img['data_url']} alt="" width="100" className="mx-auto"/>
                        <div className="image-item__btn-wrapper">
                        <button className="border-2 px-2 py-1 rounded-xl hover:border-green-400 duration-300" onClick={() => onImageUpdate(index)}>Update</button>
                        <button className="border-2 px-2 py-1 rounded-xl hover:border-red-400 duration-300" onClick={() => onImageRemove(index)}>Remove</button>
                    </div>
                    </div>
                    ))}
                </div>
                )}
            </ReactImageUploading>
                </div>
                </label>
                
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3" >Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Name"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Surname</label>
                <input value={surname} onChange={(e) => setSurname(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="text" placeholder="Surname"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="email" placeholder="Email"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Password" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Password Again</label>
                <input value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Password Again" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold ms-3">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none px-4 py-2 border-2 mb-5 rounded-xl" type="password" placeholder="Description" />
            </div>
            <button onClick={signupUser} className="bg-blue-500 py-2 rounded-xl text-white hover:bg-blue-600 duration-300 mb-5">Sign Up</button>
        </div>
    </div>)
}