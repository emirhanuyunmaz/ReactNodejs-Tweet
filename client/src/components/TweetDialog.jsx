import { useState } from "react";
import { useAddTaskMutation, useAddTweetMutation } from "../store/userApi/userApiSlicer";
import { useForm } from "react-hook-form"
import { Camera, CameraIcon } from "lucide-react";
import { getBase64 } from "../utils/imageProcess";


export default function TweetDialog({showModal, setShowModal}){

    const [addTweet,responseAddTweet] = useAddTweetMutation()
    const [addTasks,responseAddTasks] = useAddTaskMutation() 
    const [isImage,setIsImage] = useState(false)
    const [image,setImage] = useState()

    const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
      setValue,
      getValues
    } = useForm()
    
    async function uploadImage(e) {
      const file = e.target.files[0]
      const image = await getBase64(file)
      setIsImage(true)
      setImage(image)
      setValue("text",image)
    } 

    function deleteImage(){
      setValue("text","")
      setImage(undefined)
      setIsImage(false)
    }

    // Tweet atma işlemi .
    const onSubmit = async (data) => {
      console.log(data);
      
      if(image !=  undefined ){
        
        const newData= {
          ...data,
          isImage:image != undefined
        }
        console.log("Tweet data resim:",newData)
        await addTweet(newData)
        reset()
        setShowModal(false)
      }else{
        const newData= {
          ...data,
          isImage:image != undefined
        }
        console.log("Tweet data:",newData)
        await addTweet(newData)
        reset()
        setShowModal(false)
      }
    }

    async function addTaskOnClick(){
      
      if(image != undefined){        
        
        const newData = {
          ...getValues(),
          isImage:image != undefined,
        }
        console.log("New task data:",newData);
        await addTasks(newData)
      }else{
        const newData = {
          ...getValues(),
          isImage:image != undefined,
        }
        console.log("New task data:",newData);
        await addTasks(newData)
      }

      reset()
      setImage(undefined)
      setShowModal(false)
    }
    

    return(
        <>
          {showModal ? (
            <>
              <div
                className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="relative  md:w-1/2 my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-black text-xl md:text-3xl font-semibold">
                        Tweet 
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 hover:opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none duration-300"
                        onClick={() => {reset();setImage([]);setShowModal(false);}}
                      >
                        <span className=" text-black h-6 w-6 text-2xl ">
                          X
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto ">
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>

                        <input  {...register("userTag", { required: true })} placeholder="Etiket" className="px-4 mb-3 py-2 outline-none border-2 rounded-xl w-full" />
                        {errors.userTag?.type === "required" && (
                          <p className="text-red-600 mb-3 mt-0 ms-3" role="alert">Etiket boş bırakılamaz.</p>
                        )}
                        {(image == undefined) && <><textarea {...register("text", { required: true })} placeholder="Tweet" className="px-4 py-2 outline-none border-2 rounded-xl w-full h-32" />
                        {errors.text?.type === "required" && (
                          <p className="text-red-600 mb-3 mt-0 ms-3" role="alert">Tweet boş bırakılamaz.</p>
                        )}</>}

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

                        <div className="flex gap-3">
                          <button
                            className="text-black border-2 w-full px-4 py-2 rounded-xl hover:border-blue-400 duration-300"
                            type="submit"
                            
                          >
                            Tweet Ekle
                          </button>
                        </div>
                        </form>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 hover:opacity-80 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => addTaskOnClick()}
                      >
                        Taslak Kaydet
                      </button>
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear hover:opacity-80 transition-all duration-150"
                        type="button"
                        onClick={() => {setShowModal(false);reset()}}
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
        </>
      );
}