import { ImagePlus, SendHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {io} from "socket.io-client"
import Cookies from "js-cookie"
import { useGetUserAllMessageQuery, useGetUserMessageListQuery } from "../store/messageApi/messageApiSlicer"
import { useGetUserShortProfileQuery } from "../store/userApi/userApiSlicer"
import { getBase64 } from "../utils/imageProcess"

export default function Message(){

    const [userMessageList,setUserMessageList] = useState([])
    const [messageList,setMessageList] = useState([])
    const [messageText,setMessageText] = useState("")
    const[ socket,setSocket] = useState(null)
    const {id} = useParams()
    
    
    const getMessageUserList = useGetUserMessageListQuery()
    const getAllMessage = useGetUserAllMessageQuery(id)
    const getUserProfile = useGetUserShortProfileQuery(id)
    const [userProfile , setUserProfile] = useState(getUserProfile ? getUserProfile?.data?.data : null)
    

    function formatDate(date) {
        let d =new Date(date)
        let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
        let timePart = [
        d.getHours(),
        d.getMinutes(),
        ].map((n, i) => n.toString().padStart(2, "0")).join(":");
        return datePart + " " + timePart;
    }

    const connectSocket = async () => {
        const token = Cookies.get('accessToken'); // Token'ı async storage'dan al
        
        let s = io('http://localhost:3000/', {query:{token:token,userId:id}, transports: ['websocket'], reconnection: true });;
        setSocket(s)
        
        // Alıcıya mesaj geldiğinde dinle
        s.on('receiveMessage', (newMessage) => {
            console.log("NEW MESSAGE::",newMessage);
            setMessageList((prevMessages) => [...prevMessages, newMessage]);
          // }
        });
    }

    async function sendMessage(){
        if(socket !== null){
          const token = Cookies.get("accessToken")
          // Sunucuya mesaj gönderme olayı
          try{
            // console.log("MESAJ GİTTİ:",token);
            socket.emit('sendMessage', {text:messageText,token:token ,getUserId:id,isImage:false})
            setMessageText("")
          }catch(err){
            console.log("EEEE::",err);
            // Toast message:
          }
        }else{
          console.log("NOTSOCKET:::::");
        }
        getAllMessage.refetch()
      }

      // Resmin güncellenmesi işlemi.
    async function imageUpdate(event){
        if(socket !== null){
            console.log("Resmi güncelleme işlemi yapıldı");
            const file = event.target.files[0]
            const image = await getBase64(file)
            const token = Cookies.get("accessToken")                

            const reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            socket.emit('sendMessage', {text:image,token:token ,getUserId:id,isImage:true})
            setMessageText("")
            
          }else{
            console.log("NOTSOCKET:::::");
          }
          getAllMessage.refetch()
        
    }

    useEffect(() => {  
        if(id !== undefined){
            connectSocket();
        }
        // Bağlantı kesilmeden önce Socket'i temizle
        // return () => {
        //   socket.disconnect();
        // }
  
      },[id])

      useEffect(() => {
        if(getUserProfile.isSuccess){
            setUserProfile(getUserProfile.data.data)
        }
      },[id,getUserProfile.isFetching,getUserProfile.isSuccess])

      useEffect(() => {
        if(getMessageUserList.isSuccess){
            console.log(getMessageUserList.data);
            setUserMessageList(getMessageUserList.data.data)
        }
      },[getMessageUserList.isSuccess,getMessageUserList.isFetching,getMessageUserList.isError])


      useEffect(() => {
        if(getAllMessage.isSuccess){
            // console.log(getAllMessage.data);
            setMessageList(getAllMessage.data.data)
            
        }
      },[getAllMessage.isSuccess,getAllMessage.isFetching,getAllMessage.isError,id])

    return(<div className="w-full h-[90vh] flex justify-center items-center rounded-xl">
        
        <div className="h-full w-full md:h-[95%] md:w-[90%] bg-blue-200 flex rounded-xl  " >
            
            <div className={`${id != undefined && "hidden"} pt-3 md:flex w-full md:w-1/4 border-r-2 border-gray-200  h-full `}>
                
                {/* Mesajlaşılan kullanıcı kart tasarımı  */}
                <div className=" w-full flex flex-col gap-3">
                    {userMessageList?.map((user) => <a href={`/message/${user._id}`} key={user._id} className="bg-blue-300 mx-5 rounded-xl cursor-pointer flex flex-col md:flex-row items-center hover:bg-blue-400 hover:text-white duration-300 ">
                        <img src={`http://localhost:3000/${user.image}`} className="w-16 h-16 my-1 mx-3 rounded-full" alt="" />
                        <p>{user.name} {user.surname}</p>
                    </a>)}
                </div>

            </div>

            {/* Mesajlaşma kısmı */}
            {id != undefined ? <div className={` md:w-3/4 h-full w-full `}>
                <div className=" w-full flex items-center gap-3 bg-blue-400 p-2">
                    <img src={`http://localhost:3000/${userProfile?.image}`} className="w-16 h-16 rounded-full" alt="" />
                    <p className="text-xl">{userProfile?.name} {userProfile?.surname} </p>
                </div>    

                {/* Mesajların listesi */}
                <div className="h-[78%] w-full flex flex-col overflow-y-auto overflow-x-hidden py-3 px-3">

                    <div className=" flex flex-col gap-3">
                    {
                        messageList.map((message) => <div key={message._id} className="flex flex-col">
                        
                        {/* Gelen Mesaj */}
                        {message.senderUserId == id &&<div  className="border-2 rounded-r-xl rounded-t-xl px-6 py-2 me-auto">
                            {message.isImage == false && <p>{  message.message}</p>}
                            {message.isImage == true && <img src={`http://localhost:3000/${message.message}`} className="w-32 h-32" />}
                            <p className="text-[10px] text-end">{formatDate(message.createAt)}</p>
                        </div>}

                        {/* Giden Mesaj */}
                        { message.recipientUserId == id &&<div  className="flex flex-col border-2 rounded-l-xl rounded-t-xl px-6 py-2 ms-auto">
                            {message.isImage == false && <p>{message.message}</p>}
                            {message.isImage == true && <img src={`http://localhost:3000/${message.message}`} className="w-32 h-32" />}
                            <p className="text-[10px]">{formatDate(message.createAt)}</p>
                        </div>}
                        
                        </div>

                        )
                    }
                    </div>

                </div>

                {/* Mesaj atma işlemi */}
                <div className="flex  w-full h-[10%] items-center justify-center gap-2 px-2">
                        <input value={messageText} onChange={(e) => setMessageText(e.target.value) } className="w-[90%] outline-none px-4 py-2 border-2 rounded-xl" type="text" placeholder="Mesaj"/>
                        <button onClick={sendMessage} className=" border-2 px-2 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300"><SendHorizontal /></button>
                        <label htmlFor="image_message" className=" border-2 px-2 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 cursor-pointer"><ImagePlus /></label>
                        <input  onChange={(e) => imageUpdate(e)} className="hidden" id="image_message" type="file" />
                </div>
            </div>:<div className={`hidden w-full h-full md:flex justify-center items-center`} > <p className="text-4xl">Mesajlaşma Başlatın</p> </div>}
            
        </div>
        


    </div>)
}