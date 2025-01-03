import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactImageUploading from "react-images-uploading";
import { useGetSingleTaskQuery, useTaskImageUpdateMutation, useTaskUpdateMutation } from "../store/userApi/userApiSlicer";


export default function TaskUpdateDialog({showModal,setShowModal,task}){
    const getSingleTask = useGetSingleTaskQuery(task._id) 
    const [updateTask,responseUpdateTask] = useTaskUpdateMutation()
    const [taskImageUpdate,responseTaskImageUpdate] = useTaskImageUpdateMutation()
    const [image,setImage] = useState([])
    const [updateImage,setUpdateImage] = useState("")
    const maxNumber = 1;    

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
        getValues
      } = useForm({defaultValues:task})

    const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImage(imageList);
    };

    const onSubmit = async (data) => {
        await updateTask(data)
        reset()
        setShowModal(false)
    }

    async function updateImageTask(e){
      console.log(e);
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      
      reader.onload = async () => {
        await taskImageUpdate({image:reader.result,taskId:task._id})
      }
    }

    useEffect(() => {
      if(getSingleTask.isSuccess && getSingleTask.data.data){
        console.log("VERİ GUNCELLENDİ");
        console.log(getSingleTask.data.data);
        
        setValue("text",getSingleTask.data?.data.text)
        setUpdateImage(getSingleTask.data?.data.text)
        setValue("userTag",getSingleTask?.data.data.userTag)
      }

    },[getSingleTask.isFetching,getSingleTask.isSuccess,getSingleTask.isError])

    return(<>
        {showModal ? (
            <>
              <div
                className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[60] outline-none focus:outline-none"
              >
                <div className="relative  md:w-1/2 my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        Task Update 
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
                    <div className="relative p-6 flex-auto ">
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                        <input  {...register("userTag", { required: true })} placeholder="Etiket" className="px-4 mb-3 py-2 outline-none border-2 rounded-xl w-full" />
                        {errors.userTag?.type === "required" && (
                          <p className="text-red-600 mb-3 mt-0 ms-3" role="alert">Etiket boş bırakılamaz.</p>
                        )}
                        {(task.isImage != true) && !(image.length > 0) && <><textarea {...register("text", { required: true })} placeholder="Tweet" className="px-4 py-2 outline-none border-2 rounded-xl w-full h-32" />
                        {errors.text?.type === "required" && (
                          <p className="text-red-600 mb-3 mt-0 ms-3" role="alert">Tweet boş bırakılamaz.</p>
                        )}</>}

                        {task.isImage && <div>
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
                                  {task.isImage == false && image.length === 0 &&<Camera/>}
                                  </button>
                                  &nbsp;
                                  <button onClick={onImageRemoveAll}></button>
                                  {task.isImage ?<div  className="image-item flex flex-col gap-2">
                                    <img key={Date.now()} src={updateImage} alt="" width="100" className="mx-auto"/>
                                    <div className="flex gap">
                                      <label htmlFor="updateImageInput" className="border-2 px-2 py-1 rounded-xl hover:border-green-400 duration-300 cursor-pointer">Güncelle</label>
                                      <input  type="file" hidden onChange={(e) => updateImageTask(e)} id="updateImageInput" />
                                      <button  className="border-2 px-2 py-1 rounded-xl hover:border-red-400 duration-300">Sil</button>

                                    </div>
                                  </div> : imageList.map((img, index) => (
                                  <div key={index} className="image-item flex flex-col gap-2">
                                      <img src={img['data_url']  } alt="" width="100" className="mx-auto"/>
                                      <div className="image-item__btn-wrapper">
                                      <button className="border-2 px-2 py-1 rounded-xl hover:border-green-400 duration-300" onClick={() => onImageUpdate(index)}>Update</button>
                                      <button className="border-2 px-2 py-1 rounded-xl hover:border-red-400 duration-300" onClick={() => {onImageRemove(index);setValue("text","")}}>Remove</button>
                                  </div>
                                  </div>
                                  ))}
                              </div>
                              )}
                          </ReactImageUploading>
                        </div>}

                        <div className="flex gap-3">
                          <button
                            className="border-2 w-full px-4 py-2 rounded-xl hover:border-blue-400 duration-300"
                            type="submit"
                            onClick={(e) => {()=>{e.preventDefault();onSubmit()}}}
                          >
                            Taslağı Kaydet
                          </button>
                        </div>
                        </form>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
                      
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear hover:opacity-80 transition-all duration-150"
                        type="button"
                        onClick={() => {setShowModal(false);reset()}}
                      >
                        İptal
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