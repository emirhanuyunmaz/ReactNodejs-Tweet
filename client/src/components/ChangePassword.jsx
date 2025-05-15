import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../store/userApi/userApiSlicer";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


export default function ChangePassword(){
    const navigate = useNavigate()
    const [changePassword,resChangePassword] = useChangePasswordMutation()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [passwordControl,setPasswordControl] = useState(true)
    const [passwordAgainControl,setPasswordAgainControl] = useState(true)


    const showToastSucces = () => toast.success('İşlem Başarılı', {
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

    const showToastError = () => toast.error('Şifre değiştirilirken bir hata ile karşılaşıldı.', {
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

    console.log(localStorage.getItem("email"));
    

    const onSubmit = async (data)=> {
        const email = localStorage.getItem("email")
        
        const newData = {
            ...data,
            email:email
        }
        console.log(newData);

        await changePassword(newData).unwrap().then(() => {
            showToastSucces()
            navigate("/login")
        }).catch((err) => {
            showToastError()
        })

    };

    return (<div className="min-h-[80vh] w-full flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">Şifre Sıfırlama</h2>
            <p className="text-sm">Email adresinize gelen kodu giriniz ve yeni şifrenizi oluşturunuz.</p>
            <p className="pt-3 " >Email:<span className="font-bold ms-3" >{localStorage.getItem("email")}</span></p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/3 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label className="ms-2 font-bold">Kod</label>
                <input placeholder="Kod" {...register("code", { required:"Lütfen email adresinize gelen kodu giriniz." })} className="outline-none border-2  rounded-xl px-3 py-2"/>
                {errors.code && <p className="text-red-600 ms-2 text-sm ">{errors.code.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="ms-2 font-bold">Şifre</label>
                <div className="flex border-2  rounded-xl px-3 py-2">
                    <input placeholder="Şifre" type={`${passwordControl ? "password" : "text"}`} {...register("password", { required:"Lütfen yeni şifrenizi giriniz." })} className="outline-none w-full" />
                    <button onClick={(e) => {e.preventDefault();setPasswordControl(!passwordControl)}} >{passwordControl ? <Eye/> : <EyeOff/>}</button>
                </div>
                {errors.password && <p className="text-red-600 ms-2 text-sm ">{errors.password.message}</p>}

            </div>
            <div className="flex flex-col gap-1">
                <label className="ms-2 font-bold">Şifre Tekrar</label>
                <div className="flex border-2  rounded-xl px-3 py-2" > 
                    <input placeholder="Şifre Tekrar" type={`${passwordAgainControl ? "password":"text"}`} {...register("passwordAgain", { required:"Lütfen şifrenizi Tekrar giriniz.",validate: (val) => {
                        if (watch('password') != val) {
                            return "Şifreler eşleşmiyor";
                        }}}
                    )} className="outline-none w-full" />
                    <button onClick={(e) => {e.preventDefault();setPasswordAgainControl(!passwordAgainControl)}} >{passwordAgainControl ? <Eye/> : <EyeOff/>}</button>
                </div>
                {errors.passwordAgain && <p className="text-red-600 ms-2 text-sm ">{errors.passwordAgain.message}</p>}

            </div>
            <div className="flex flex-col gap-1">
                <button className="bg-blue-400 text-white py-2 rounded-xl hover:bg-blue-600 duration-300">Gönder</button>
            </div>
        </form>

    </div>)
}