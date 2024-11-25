import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useDeleteTaskMutation, useTaskToTweetMutation } from "../store/userApi/userApiSlicer";


export default function SingleTask({task}){

    const [preferenceControl ,setPreferenceControl] = useState(false)
    const [deleteTask,responseDeleteTask] = useDeleteTaskMutation()
    const [taskToTweet,responseTaskToTweet] = useTaskToTweetMutation()

    function deleteTaskOnClick(){
        const body = {
          taskId:task._id
        }
        deleteTask(body)
    }

    function shareOnClick(){
        // console.log(task);
        
        taskToTweet(task)
    }

    return (<div className="bg-blue-200 flex flex-col gap-3 min-w-32 min-h-32 px-2 py-1 rounded-xl items-center ">
        <div className="relative flex items-end justify-end w-full">
            <button onClick={() => setPreferenceControl(!preferenceControl)}><EllipsisVertical width={16} /></button>
            {preferenceControl && <div className="absolute flex flex-col gap-1 bg-white rounded-xl px-4 py-1 top-2 right-4 ">
                <div className="flex flex-col gap-2 z-10">
                    <button onClick={deleteTaskOnClick} className="bg-blue-300 rounded-xl px-3 py-1 hover:bg-blue-400 duration-300">Sil</button>
                    <button onClick={shareOnClick} className="bg-blue-300 rounded-xl px-2 py-1 hover:bg-blue-400 duration-300" >Paylaş</button>
                </div>
                <div onClick={() => setPreferenceControl(false)} className=" fixed inset-0 z-0"></div>
            </div>}
        </div>
        <div>
            <h6 className="font-bold">{task?.userTag}</h6>
            { !task.isImage  && <p>{task.text}</p>}
            { task.isImage  && <img src={`http://localhost:3000/user/profile/image/${task.text}`} className="w-32 h-32" />}
        </div>
    </div>)
}