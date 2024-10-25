import { useEffect, useState } from "react";
import { useGetUserTweetLikeListQuery, useTweetLikeMutation, useUserTweetDislikeMutation } from "../store/userApi/userApiSlicer";
import { Heart, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";


export default function TweetList({tweetList}){

    const navigate = useNavigate()
    const userTweetLikeList = useGetUserTweetLikeListQuery()
    const [userLikeTweet,responseLikeTweet] = useTweetLikeMutation()
    const [tweetDislike,responseTweetDislike] = useUserTweetDislikeMutation()
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

    async function setLikeTweet(tweetId){
        const tweetLikeBody = {tweetId:tweetId} 
        await userLikeTweet(tweetLikeBody)
    }

    useEffect(() => {
        if(userTweetLikeList.isSuccess){
            getTweetLikeList()
        }

    },[userTweetLikeList.isFetching,userTweetLikeList.isSuccess])
    
    
    return(<>
        {
            tweetList.map((tweet) => {
            return <div key={tweet._id} className="flex flex-col mx-16 gap-3 border-2 bg-blue-100 p-3 rounded-xl hover:shadow-xl duration-300">
                {/* USER */}
                <div className="flex items-center gap-5">
                    <img className="w-10 h-10 rounded-full" src={`http://localhost:3000/user/profile/image/${tweet.userId.image}`} alt="" />
                    <div className="flex flex-col">
                        <a href={`/user/${tweet.userId._id}`}>{tweet.userId.name}  {tweet.userId.surname}</a>
                        <p className="text-xs">{formatDate(tweet.createdAt)}</p>
                        <a href={`/userTag/${tweet.userTag}`} className="font-bold hover:underline">#{tweet.userTag}</a>

                    </div>
                    <div className="ms-auto">
                        <p className="font-bold">{tweet.tag.toUpperCase()}</p>
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
                    
                    {/* <button onClick={() => retweetOnClick(tweet._id)} className="flex gap-1 "><Repeat2 /></button> */}
                    <button onClick={(e) => CommentPage(tweet._id)} className="flex gap-1 "> <MessageCircle />{tweet.comments.length}</button>
                </div>
            </div>
            } )
        }
    </>)
}