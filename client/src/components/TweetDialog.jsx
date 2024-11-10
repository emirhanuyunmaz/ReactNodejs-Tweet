import { useEffect, useState } from "react";
import { useAddTweetMutation } from "../store/userApi/userApiSlicer";
import { useForm } from "react-hook-form"


export default function TweetDialog({showModal, setShowModal}){

    const [addTweet,responseAddTweet] = useAddTweetMutation()
    
    const {
      register,
      formState: { errors },
      handleSubmit,
      reset
    } = useForm()

    const onSubmit = async (data) => {
      console.log(data)
      await addTweet(data)
      reset()
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
                      <h3 className="text-3xl font-semibold">
                        Tweet 
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 hover:opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none duration-300"
                        onClick={() => {setShowModal(false);setTagText("");setTweetText("")}}
                      >
                        <span className=" text-black h-6 w-6 text-2xl ">
                          X
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto ">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <input  {...register("userTag", { required: true })} placeholder="Etiket" className="px-4 mb-3 py-2 outline-none border-2 rounded-xl w-full" />
                        {errors.userTag?.type === "required" && (
                          <p className="text-red-600 mb-3 mt-0 ms-3" role="alert">Etiket boş bırakılamaz.</p>
                        )}
                        <textarea {...register("text", { required: true })} placeholder="Tweet" className="px-4 py-2 outline-none border-2 rounded-xl w-full h-32" />
                        {errors.text?.type === "required" && (
                          <p className="text-red-600 mb-3 mt-0 ms-3" role="alert">Tweet boş bırakılamaz.</p>
                        )}
                        <button
                          className="border-2 w-full px-4 py-2 rounded-xl hover:border-blue-400 duration-300"
                          type="submit"
                          onClick={onSubmit}
                        >
                        Tweet Ekle
                      </button>
                        </form>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {setShowModal(false);setTagText("");setTweetText("")}}
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