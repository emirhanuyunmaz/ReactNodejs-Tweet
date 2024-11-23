import { EllipsisVertical } from "lucide-react";
import { useState } from "react";


export default function SingleTask({task}){

    const [preferenceControl ,setPreferenceControl] = useState(false)

    return (<div className="bg-blue-200 flex flex-col gap-3 min-w-32 min-h-32 px-2 py-1 rounded-xl items-center ">
        <div className="relative flex items-end justify-end w-full">
            <button onClick={() => setPreferenceControl(!preferenceControl)}><EllipsisVertical width={16} /></button>
            {preferenceControl && <div className="absolute flex flex-col gap-1 bg-white rounded-xl px-4 py-1 top-2 right-4 ">
                <div className="flex flex-col gap-2 z-10">
                    <button className="bg-blue-300 rounded-xl px-3 py-1 hover:bg-blue-400 duration-300">Sil</button>
                    <button className="bg-blue-300 rounded-xl px-2 py-1 hover:bg-blue-400 duration-300" >Paylaş</button>
                </div>
                <div onClick={() => setPreferenceControl(false)} className=" fixed inset-0 z-0"></div>
            </div>}
        </div>
        <div>
            <h6 className="font-bold">{task?.userTag}</h6>
            { task.isImage === "false" && <p>{task.text}</p>}
            { task.isImage === "true" && <img src={`http://localhost:3000/user/profile/image/${task.text}`} className="w-32 h-32" />}
        </div>
    </div>)
}