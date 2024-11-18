import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom"
import { useGetUserShortProfileQuery,useUserTweetProfileQuery } from "../store/userApi/userApiSlicer";
import TweetList from "../components/TweetList";


export default function UserProfile(){
    const params = useParams()
    // Kullanıcı id bilgisine göre safada gönderilerin görüntülenmesi işlemi.
    // console.log(params.id);
    const [tweetList,setTweetList] = useState([])
    const [isProfile,setIsProfile] = useState(false)
    const [searchText,setSearchText] = useState("")
    let data = {
        id:params.id,
        text:searchText
    }
    const userTweetProfile = useUserTweetProfileQuery(data)
    const userShortProfile = useGetUserShortProfileQuery(params.id)
    const [userProfile,setUserProfile] = useState({})

    function formatDateProfile(date) {
        let d =new Date(date)
        let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
        return datePart ;
    }

    function getShortProfile(){
        console.log(userProfile);
        setUserProfile(userShortProfile.data.data)
        // console.log("User Profile:",userShortProfile.data.data);
    }




    useEffect(() => {
        if(userShortProfile.isSuccess){
            getShortProfile()
        }
    },[userShortProfile.isSuccess,userShortProfile.isFetching])


    useEffect(() => {
        if(userTweetProfile.isSuccess){
            data = {
                id:params.id,
                text:searchText
            }
            setTweetList(userTweetProfile.data.data)
            // console.log("SS:::SS",userTweetProfile.data.userProfile);
            setIsProfile(userTweetProfile.data.userProfile)
        }
    },[userTweetProfile.isFetching,userTweetProfile.isSuccess,searchText])

    

    return (<div className="md:w-3/4 md:mx-auto mt-10">

        {/* Kullanıcı profili için temel yapı */}
        <div className="bg-blue-100  md:px-10 py-5 rounded-xl">
            <div className="flex gap-5" >
                <img className="w-32 h-32 rounded-full" src={`http://localhost:3000/user/profile/image/${userProfile.image}`} alt="" />
                <div className="mt-5 flex flex-col gap-3">
                    <p className="font-bold" > {userProfile.name} {userProfile.surname}</p>
                    <p>{userProfile.description}</p>
                    <p>{formatDateProfile(userProfile.createdAt)}</p>
                </div>
                {!isProfile && <div className="ms-auto flex flex-col justify-center">
                    <button className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takip Et</button>
                    <button className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Mesaj At</button>
                </div>}
                {
                    isProfile &&<div className="ms-auto flex flex-col justify-center"> <a href="/profile" className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Profili Düzenle</a></div>
                }
            </div>
        </div>
            {/* Tweet arama işlemi */}
            <div className="flex  justify-start items-center gap-3 ms-10 mt-3">
                <input onChange={(e) => setSearchText(e.target.value)} value={searchText} className="w-1/2 outline-none px-4 py-2 border-2  rounded-xl" type="text" placeholder="Tweet Ara"/>
                {/* <button onClick={(e) => searchTweetUser(e)} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Ara</button> */}
            </div>

            {/* Tweet List */}
            <div className="flex px-5 md:px-10 flex-col w-full gap-5 mt-3">
                <TweetList tweetList={tweetList} />
            </div>
    </div>)
}