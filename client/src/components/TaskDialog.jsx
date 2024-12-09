import { useEffect, useState } from "react";
import {  useGetTaskListQuery } from "../store/userApi/userApiSlicer";
import SingleTask from "./SingleTask";


export default function TaskDialog({showModal, setShowModal}){

    const getTaskList = useGetTaskListQuery()
  
    const [taskList,setTaskList] = useState([])
  


    useEffect(() => {
        if(getTaskList.isSuccess){
            console.log(getTaskList.data);
            
            setTaskList(getTaskList.data.data)
        }
    },[getTaskList.isFetching,getTaskList.isError,getTaskList.isSuccess])

    return(<>{showModal ? (
        <>
          <div
            className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none "
          >
            <div className="relative md:w-1/2  my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ">
                {/*header*/}
                <div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Tasks 
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 hover:opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none duration-300"
                    onClick={() => setShowModal(false)}
                  >
                    <span className=" text-black h-6 w-6 text-2xl ">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="flex p-6 gap-3 overflow-y-auto  ">
                    {/* Task list  */}
                    {
                        taskList.map((task) =><SingleTask key={task._id} task={task} /> )
                    }
                    {
                      !(taskList.length > 0)  && <p className="mx-auto">Task Listeniz Boş</p>
                    }
                    
                    
                    {/* Task list - end */}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear hover:opacity-80 transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Kapat
                  </button>

                  
                </div>
              </div>
            </div>
          </div>
          <div  className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>)
}