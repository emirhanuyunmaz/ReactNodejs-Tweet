import { EllipsisVertical, Heart, MessageCircle } from "lucide-react";
import { useDeleteTweetMutation, useTweetLikeMutation, useUserTweetDislikeMutation } from "../store/userApi/userApiSlicer";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";


export default function TweetCard({tweet,userTweetLike,isUserProfile}){
    const context = useContext(userContext)
    const navigate = useNavigate() 
    const [userLikeTweet,responseLikeTweet] = useTweetLikeMutation()
    const [tweetDislike,responseTweetDislike] = useUserTweetDislikeMutation()
    const [isUser,setIsUser] = useState(isUserProfile ?isUserProfile : false)
    const [preferenceControl,setPreferenceControl] = useState(false)
    const [deleteTweet,responseDeleteTweet] = useDeleteTweetMutation()
    


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
    

    function CommentPage(tweetId){
        navigate(`/tweet/${tweetId}`)
    }

    async function userTweetDislike(tweetId){        
        await tweetDislike({tweetId:tweetId})
        await context.tweetUnfollowSocket(tweet,"unfollow")
    }

    async function setLikeTweet(tweetId){
        const tweetLikeBody = {tweetId:tweetId} 
        await userLikeTweet(tweetLikeBody)
        await context.tweetFollowSocket(tweet,"follow")
    }

    return(<div key={tweet._id} className="flex flex-col gap-3 border-2 bg-blue-100 p-3 rounded-xl hover:shadow-xl duration-300">
        {/* USER */}
        <div className="relative flex items-center gap-5">
            <img className="w-10 h-10 rounded-full" src={`${tweet.userId.image}`} alt="" />
            <div className="flex flex-col">
                <a href={`/user/${tweet.userId._id}`}>{tweet.userId.name}  {tweet.userId.surname}</a>
                <p className="text-xs">{formatDate(tweet.createdAt)}</p>
                <a href={`/userTag/${tweet.userTag}`} className="font-bold hover:underline">#{tweet.userTag}</a>

            </div>
            <div className="ms-auto mt-3">
                <p className="font-bold">{tweet.tag.toUpperCase()}</p>
            </div>

            {isUser == true && <div className="absolute right-0 top-0">
                <button className="hover:bg-blue-300 hover:text-white rounded-full duration-300" onClick={() =>setPreferenceControl(!preferenceControl) }> <EllipsisVertical /> </button>
                {preferenceControl && <div className="absolute flex flex-col gap-1 bg-blue-50 border-2 border-gray-300 rounded-xl px-4 py-1 top-2 right-4 ">
                <div className="flex flex-col gap-2 z-10 ">
                    <button onClick={() => deleteTweet({id:tweet._id})} className="bg-blue-300 rounded-xl px-3 py-1 hover:bg-blue-400 duration-300 ">Sil</button>
                </div>
                <div onClick={() => setPreferenceControl(false)} className=" fixed inset-0 z-0"></div>
                </div>}
            </div>}
        </div>
        {/* TWEET */}
        <div className="ms-10">
            { !tweet.isImage && <p>{ tweet.text}</p>}
            {/* http://localhost:3000/user/profile/image/ */}
            { tweet.isImage && <img src={`${tweet.text}`} className="w-1/2 mx-auto border-2 rounded-xl" />}
        </div>
        <div className="flex justify-between md:px-16">
            {   
                userTweetLike.includes(tweet._id) ? (<button onClick={() => userTweetDislike(tweet._id)} className="flex gap-1 "><Heart  color="red" fill={`red`} /> {tweet.likes.length}</button> ):( <button onClick={()=>setLikeTweet(tweet._id)} className="flex gap-1 "><Heart /> {tweet.likes.length}</button>)
            }
            
            {/* <button onClick={() => retweetOnClick(tweet._id)} className="flex gap-1 "><Repeat2 /></button> */}
            <button onClick={(e) => CommentPage(tweet._id)} className="flex gap-1 "> <MessageCircle />{tweet.comments.length}</button>
        </div>
    </div>)
}