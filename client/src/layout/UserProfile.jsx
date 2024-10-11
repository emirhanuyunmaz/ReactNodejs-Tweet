import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useGetUserShortProfileQuery, useGetUserTweetLikeListQuery, useTweetLikeMutation, useUserTweetDislikeMutation, useUserTweetProfileQuery } from "../store/userApi/userApiSlicer";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";


export default function UserProfile(){
    const params = useParams()
    const navigate = useNavigate()
    // Kullanıcı id bilgisine göre safada gönderilerin görüntülenmesi işlemi yapılacak.
    console.log(params.id);
    const [tweetList,setTweetList] = useState([])
    const [userTweetLike,setUserTweetLike] = useState([])
    const userTweetProfile = useUserTweetProfileQuery(params.id)
    const userTweetLikeList = useGetUserTweetLikeListQuery()
    const userShortProfile = useGetUserShortProfileQuery(params.id)
    const [userLikeTweet,responseLikeTweet] = useTweetLikeMutation()
    const [tweetDislike,responseTweetDislike] = useUserTweetDislikeMutation()
    const [userProfile,setUserProfile] = useState({})

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

    function formatDateProfile(date) {
        let d =new Date(date)
        let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
        return datePart ;
    }

    async function setLikeTweet(tweetId){
        const tweetLikeBody = {tweetId:tweetId} 
        await userLikeTweet(tweetLikeBody)
    }

    function getShortProfile(){
        console.log(userProfile);
        setUserProfile(userShortProfile.data.data)
        console.log("USer Profile:",userShortProfile.data.data);
    }



    async function getTweetLikeList(){
        if(userTweetLikeList.data.data === null){
            setUserTweetLike([])    
        }else{
            setUserTweetLike(userTweetLikeList?.data?.data?.tweetList)
        }
    }

    function CommentPage(tweetId){
        navigate(`/tweet/${tweetId}`)
    }

    async function userTweetDislike(tweetId){        
        tweetDislike({tweetId:tweetId})
    }

    useEffect(() => {
        if(userShortProfile.isSuccess){
            getShortProfile()
        }
    },[userShortProfile.isSuccess,userShortProfile.isFetching])

    useEffect(() => {
        if(userTweetLikeList.isSuccess){
            getTweetLikeList()
        }

    },[userTweetLikeList.isFetching,userTweetLikeList.isSuccess])

    useEffect(() => {
        if(userTweetProfile.isSuccess){
            setTweetList(userTweetProfile.data.data)
        }
    },[userTweetProfile.isFetching , userTweetProfile.isSuccess])

    return (<div className="w-3/4 mx-auto mt-10">

        {/* Kullanıcı profili için temel yapı */}
        <div className="bg-blue-100 px-10 py-5 rounded-xl">
            <div className="flex gap-5" >
                <img className="w-32 h-32 rounded-full" src={`http://localhost:3000/user/profile/image/${userProfile.image}`} alt="" />
                <div className="mt-5 flex flex-col gap-3">
                    <p className="font-bold" > {userProfile.name} {userProfile.surname}</p>
                    <p>{userProfile.description}</p>
                    <p>{formatDateProfile(userProfile.createdAt)}</p>
                </div>
            </div>
        </div>

        
            {/* Tweet List */}
            <div className="flex flex-col gap-5 mt-10">
                {
                    tweetList &&
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
                            <button onClick={(e) => CommentPage(tweet._id)} className="flex gap-1 "> <MessageCircle />{tweet.comments.length}</button>
                        </div>
                    </div>
                    } )
                }
            </div>
        


    </div>)
}