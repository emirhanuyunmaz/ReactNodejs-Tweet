import { Heart, MessageCircle, Repeat2, Search } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useAddTweetMutation, useGetTweetListQuery, useGetUserProfileQuery, useGetUserTweetLikeListQuery, useTweetLikeMutation, useUserTweetDislikeMutation } from "../store/userApi/userApiSlicer";

export default function Tweet(){
    // const {token,refreshToken} = useContext(userContext)
    const {data,isLoading,isError,error,isSuccess,isFetching} = useGetTweetListQuery()
    const getuserP = useGetUserProfileQuery()
    const [userAddTweet,response] = useAddTweetMutation()
    const [userLikeTweet,responseLikeTweet] = useTweetLikeMutation()
    const [tweetDislike,responseTweetDislike] = useUserTweetDislikeMutation()
    const userTweetLikeList = useGetUserTweetLikeListQuery()
    const [tweetText , setTweetText] = useState("") 
    const [tweetList,setTweetList] = useState([])
    const [userProfile,setUserProfile] = useState({})
    const [userTweetLike,setUserTweetLike] = useState([])

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

    async function getUserProfile(){
        setUserProfile(getuserP.data)
    }

    async function addTweet(){
        await userAddTweet({text:tweetText})
        setTweetText("")
    }

    async function getTweetList(){
        setTweetList(data.tweetList)
    }

    async function setLikeTweet(tweetId){
        const tweetLikeBody = {tweetId:tweetId} 
        await userLikeTweet(tweetLikeBody)
    }

    async function getTweetLikeList(){
        if(userTweetLikeList.data.data === null){
            setUserTweetLike([])    
        }else{
            setUserTweetLike(userTweetLikeList?.data?.data?.tweetList)
        }
    }

    async function userTweetDislike(tweetId){
        console.log("sssaaa");
        
        tweetDislike({tweetId:tweetId})
    } 

    useEffect(() => {
        // getUserProfile()
        if(isSuccess){
            getTweetList()
        }
    },[isLoading,isError,isSuccess,isFetching])

    useEffect(() => {
        if(getuserP.isSuccess){
            getUserProfile()
        }
    },[getuserP])

    useEffect(() => {
        if(userTweetLikeList.isSuccess){
            getTweetLikeList()
        }

    },[userTweetLikeList.isFetching,userTweetLikeList.isSuccess])


    return(
    <div className="flex w-full md:min-h-[90vh] justify-center ">
        
        <div className="bg-green-200 rounded-xl hidden md:flex md:w-1/6 mt-5">
            <div className="w-full flex flex-col items-center" >
                <img className="w-1/2 mt-5 rounded-full" src={`http://localhost:3000/user/profile/image/${userProfile.image}`} alt="" />

                <p>{userProfile.name} {userProfile.surname}</p>

                <div>
                    <a href={`/user/${userProfile._id}`}>Profile</a>
                </div>
            </div>

        </div>


        <div className="flex flex-col-reverse md:flex-row w-full md:w-3/4  md:gap-3">
            <div className="flex flex-col mt-5 md:mt-0 w-full  md:p-5">
                {/* ADD TWEET */}
                <div className="flex flex-col md:flex-row  w-full gap-5 mb-5 px-16 md:px-0 md:mx-16">
                    <textarea value={tweetText} onChange={(e) => setTweetText(e.target.value)} placeholder="Tweet" className="outline-none border-2 p-3 w-full md:w-3/4 min-h-32 max-h-32 rounded-xl"/>
                    <button onClick={addTweet} className="bg-blue-200 hover:bg-blue-400 hover:text-white duration-300 px-4 py-1 rounded-xl">Add</button>
                </div>
                {/* TWEET LIST */}
                <div className="flex flex-col gap-5">
                {
                    tweetList.map((tweet) => {
                    return <div key={tweet._id} className="flex flex-col mx-16 gap-3 border-2 bg-blue-100 p-3 rounded-xl hover:shadow-xl duration-300">
                        {/* USER */}
                        <div className="flex items-center gap-5">
                            <img className="w-10 h-10 rounded-full" src={`http://localhost:3000/user/profile/image/${tweet.userId.image}`} alt="" />
                            <div className="flex flex-col">
                                <a href={`/user/${tweet.userId._id}`}>{tweet.userId.name}  {tweet.userId.surname}</a>
                                <p className="text-xs">{formatDate(tweet.createdAt)}</p>
                            </div>
                        </div>
                        {/* TWEET */}
                        <div className="ms-10">
                            <p>{tweet.text}</p>
                        </div>
                        <div className="flex justify-between md:px-16">
                            {
                                userTweetLike.includes(tweet._id) ? (<button onClick={() => userTweetDislike(tweet._id)} className="flex gap-1 "><Heart  color="red" fill={`red`} /> {tweet.likes.length}</button> ):( <button onClick={()=>setLikeTweet(tweet._id)} className="flex gap-1 "><Heart /> {tweet.likes.length}</button>)
                            }
                            
                            <button className="flex gap-1 "><Repeat2 /></button>
                            <button className="flex gap-1 "> <MessageCircle />{tweet.comments.length}</button>
                        </div>
                    </div>
                    } )
                }
                </div>
            </div>
            
            <div className="flex flex-col w-full md:w-1/4 px-16 md:px-0 md:p-5">
                
                <div className=" bg-blue-100 p-5 rounded-xl">
                    <h6 className="text-sm font-bold">Etiketler</h6>
                    <div className=" mx-3">
                        <ul className="flex flex-wrap md:flex-col gap-3">
                            <li className="w-full" ><a href="" className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Lorem.</p></a></li>
                            <li className="w-full" ><a href=""className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Deserunt.</p></a></li>
                            <li className="w-full" ><a href="" className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Lorem.</p></a></li>
                            <li className="w-full" ><a href=""className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Deserunt.</p></a></li>
                            <li className="w-full" ><a href="" className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Lorem.</p></a></li>
                            <li className="w-full" ><a href=""className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Deserunt.</p></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            


        </div>
    </div>)
}