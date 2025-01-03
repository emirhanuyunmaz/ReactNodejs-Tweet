import { useEffect, useState } from "react";
import { useAddRetweetMutation, useGetSingleTweetQuery } from "../store/userApi/userApiSlicer";


export default function RetweetDialog({showModal, setShowModal,tweetId}){

    const {data,isFetching,isSuccess,isError} =useGetSingleTweetQuery(tweetId)
    
    const [addRetweet,responseRetweet] = useAddRetweetMutation()

    const [tweetData,setTweetData] = useState({})

    const [text,setText] = useState("")

    // Tarih bilgisini formatlama için kullanılan fonksiyon.
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


    async function AddRetweetHandleClick(){
        const retweetBody = {text:text,tweetId:tweetId}
        await addRetweet(retweetBody)
        setShowModal(false)
    }


    useEffect(() => {
        if(isSuccess){
            setTweetData(data.data)
            console.log(":::",tweetData);
            
        }
    },[isFetching,isSuccess,isError])

    return(
        <>
          {showModal && isSuccess ? (
            <>
              <div
                className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="relative  md:w-1/2 my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        Retweet 
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                      >
                        <span className=" text-black h-6 w-6 text-2xl ">
                          X
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Retweet" className="px-4 py-2 outline-none border-2 rounded-xl w-full h-32" />
                        {/* TWEET */}
                        <div className="flex flex-col gap-3">
                            {/* USER */}
                            <div className="flex items-center gap-5">
                                <img className="w-10 h-10 rounded-full" src={`http://localhost:3000/user/profile/image/${tweetData?.userId?.image}`} alt="" />
                                <div className="flex flex-col">
                                    <a href={`/user/${123321}`}>{tweetData?.userId?.name}  {tweetData?.userId?.surname}</a>
                                    <p className="text-xs">{formatDate(tweetData?.createdAt)}</p>
                                </div>
                            </div>

                            {/* TWEET */}
                            <div className="ms-10">
                                <p>{tweetData?.text}</p>
                            </div>
                        </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Kapat
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={AddRetweetHandleClick}
                      >
                        Retweetle
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