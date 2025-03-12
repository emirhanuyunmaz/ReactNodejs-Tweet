import { Check, X } from "lucide-react";
import { useNotificationFollowAcceptMutation, useNotificationFollowRejectMutation, useUserNotificationListQuery } from "../store/contactApi/contactApiSlicer";
import { useEffect, useState } from "react";


export default function NotificationCard({setControl,notificationLength}){
    const getAllNotification = useUserNotificationListQuery()
    const [notificationFollowAccept,resNotificationFollowAccept] = useNotificationFollowAcceptMutation()
    const [notificationFollowReject,resNotificationFollowReject] = useNotificationFollowRejectMutation()
    const [data,setData] = useState([]) 
    useEffect(() => {

        if(getAllNotification.isSuccess){
            console.log("DATA:::",getAllNotification.data);
            setData(getAllNotification.data?.data)
        }

    },[getAllNotification.isSuccess,getAllNotification.isFetching])

    async function FollowAcceptOnClick(userId){
        const body ={
            userId:userId
        }
        await notificationFollowAccept(body)
        getAllNotification.refetch()
    }

    async function FollowRejectOnClick(userId){
        const body ={
            userId:userId
        }
        await notificationFollowReject(body)
        getAllNotification.refetch()
    }

    useEffect(() => {
        getAllNotification.refetch()
    },[notificationLength])

    return(<div>
        <div className=" relative flex z-50">
            <div className={`absolute bg-blue-300 w-72 text-black px-1 mt-8 ms-[-200px] py-2 rounded-xl z-10`}>
                {/* Son 5 bildirim ve bildirimleri tamamı için bir sayfa. */}
                <ul className="flex flex-col gap-2">
                    {
                        data.length == 0 && <p>Herhangi bir bildiriminiz bulumamaktadır.</p>
                    }
                    
                    {
                        data.length > 0 && data.map((item) => item.process == "like" ? <li key={item._id} className="flex items-center gap-2 hover:bg-blue-400 px-6 py-1 rounded-xl hover:shadow-xl duration-300">
                            <a href={`/tweet/${item.postId}`} className="flex items-center gap-3">
                                <img src={`http://localhost:3000/${item.transactionUser.image}`} className="w-12 rounded-full" alt="" />
                                <div className="flex flex-col">
                                    <p className="font-semibold">{item.transactionUser.name} {item.transactionUser.surname}</p>
                                    <p>Tweetinizi beğendi</p>
                                </div>
                            </a>
                    </li> : item.process == "tweetComment" ? <li key={item._id} className="flex items-center gap-2 hover:bg-blue-400 px-6 py-1 rounded-xl hover:shadow-xl duration-300">
                            <a href={`/tweet/${item.postId}`} className="flex items-center gap-3">
                                <img src={`http://localhost:3000/${item.transactionUser.image}`} className="w-12 rounded-full" alt="" />
                                <div className="flex flex-col">
                                    <p className="font-semibold">{item.transactionUser.name} {item.transactionUser.surname}</p>
                                    <p>Tweetinize Yorum yaptı</p>
                                </div>
                            </a>
                    </li>:
                     item.process == "directFollow" ? <li key={item._id} className="flex items-center gap-2 hover:bg-blue-400 px-6 py-1 rounded-xl hover:shadow-xl duration-300">
                     <a href={`/user/${item.transactionUser._id}`} className="flex items-center gap-3">
                     <img src={`http://localhost:3000/${item.transactionUser.image}`} className="w-12 rounded-full" alt="" />
                     <div className="flex flex-col">
                             <p className="font-semibold">{item.transactionUser.name} {item.transactionUser.surname}</p>
                             <p>Sizi takip etti</p>
                         </div>
                     </a>
                    </li>:
                    <li key={item._id} className="flex items-center gap-2 hover:bg-blue-400 px-6 py-1 rounded-xl hover:shadow-xl duration-300">
                        
                        <img src={`http://localhost:3000/${item.transactionUser.image}`} className="w-12 rounded-full" alt="" />
                        <div className="flex flex-col">
                            <a href={`/user/${item.transactionUser._id}`} className="flex gap-1 hover:underline">
                                <p className="font-semibold">{item.transactionUser.name} {item.transactionUser.surname}</p>
                            </a>
                            {!(item.followProcess == "accept" || item.followProcess == "reject") && <p>Takip İsteği Attı</p>}
                            {item.followProcess == "accept" && <p>Takip İsteğini kabul ettin.</p>}
                            {item.followProcess == "reject" && <p>Takip İsteğini reddettiniz.</p>}
                        </div>
                        {!(item.followProcess == "accept" || item.followProcess == "reject") && <><button onClick={() => FollowAcceptOnClick(item.transactionUser._id)} className="text-white hover:text-gray-300 duration-300"><Check /></button>
                        <button onClick={() => FollowRejectOnClick(item.transactionUser._id)} className="text-white hover:text-gray-300 duration-300"><X /></button></>}
                    </li>)
                    }
                    
                </ul>
            </div>
        </div>
    </div>)
}