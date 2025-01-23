import { Check, X } from "lucide-react";
import { useUserNotificationListQuery } from "../store/contactApi/contactApiSlicer";
import { useEffect, useState } from "react";


export default function NotificationCard({setControl}){
    const getAllNotification = useUserNotificationListQuery()
    const [data,setData] = useState([]) 
    useEffect(() => {

        if(getAllNotification.isSuccess){
            console.log("DATA:::",getAllNotification.data);
            setData(getAllNotification.data?.data)
        }

    },[getAllNotification.isSuccess,getAllNotification.isFetching])


    return(<div>
        <div className=" relative flex z-50">
            <div className={`absolute bg-blue-300 w-72 text-black px-1 mt-8 ms-[-200px] py-2 rounded-xl z-10`}>
                {/* Son 5 bildirim ve bildirimleri tamamı için bir sayfa. */}
                <ul className="flex flex-col gap-2">
                    {
                        data.map((item) => <li key={item._id} className="flex items-center gap-2 hover:bg-blue-400 px-6 py-1 rounded-xl hover:shadow-xl duration-300">
                            <a href={`/tweet/${item.postId}`} className="flex items-center gap-3">
                                <img src={item.transactionUser.image} className="w-12 rounded-full" alt="" />
                                <p>Tweetinizi beğendi</p>
                            </a>
                    </li>)
                    }
                    

                    <li className="flex items-center gap-2 hover:bg-blue-400 px-6 py-1 rounded-xl hover:shadow-xl duration-300">
                        <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-12 rounded-full" alt="" />
                        <p>Takip İsteği</p>
                        <button className="text-white hover:text-gray-300 duration-300"><Check /></button>
                        <button className="text-white hover:text-gray-300 duration-300"><X /></button>
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>)
}