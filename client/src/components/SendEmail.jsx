import { useState } from "react"
import { useResetPasswordSendEmailMutation } from "../store/userApi/userApiSlicer"
import { toast, Zoom } from "react-toastify";

export default function SendEmail({setPosition}){

    const [resetPasswordSendEmail,resResetPasswordSendEmail] = useResetPasswordSendEmailMutation()
    
    const [email ,setEmail] = useState("")

    const showToastSucces = () => toast.success('Mail Gönderildi', {
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

    const showToastError = () => toast.error('Mail gönderilirken bir hata ile karşılaşıldı.', {
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

    async function resetPasswordOnClick(){
        const body = {
            email:email
        }
    
        await resetPasswordSendEmail(body).unwrap().then(() => {
        // email local storage kayıt
            localStorage.setItem("email",email)
            showToastSucces()
            setPosition(1)
        }).catch((err) => {
            // Toast ERR
            console.log("Send Email",err);
            
            showToastError()
        })
        
    }
    return (<>
        <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold">Parolanızı Sıfırlayın </h2>
                <p className="text-sm">Hasabınıza ait email adresini girerek şifre yenilemek için kod alabilirsiniz.</p>
            </div>
            <div className="w-full md:w-1/3">
                <div className="flex flex-col">
                    <label htmlFor="email" className="ms-2 font-bold">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email" className="outline-none border-2 rounded-xl px-3 py-2 " />
                </div>

            </div>
            <div className="flex ">
                <button onClick={resetPasswordOnClick} className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-2 rounded-xl duration-300">Kod Gönder</button>
            </div>

    </>)
}