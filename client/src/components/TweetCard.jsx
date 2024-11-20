import { Heart, MessageCircle } from "lucide-react";
import { useTweetLikeMutation, useUserTweetDislikeMutation } from "../store/userApi/userApiSlicer";
import { useNavigate } from "react-router-dom";


export default function TweetCard({tweet,userTweetLike}){
    const navigate = useNavigate() 
    const [userLikeTweet,responseLikeTweet] = useTweetLikeMutation()
    const [tweetDislike,responseTweetDislike] = useUserTweetDislikeMutation()

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
        tweetDislike({tweetId:tweetId})
    }

    async function setLikeTweet(tweetId){
        const tweetLikeBody = {tweetId:tweetId} 
        await userLikeTweet(tweetLikeBody)
    }


    return(<div key={tweet._id} className="flex flex-col gap-3 border-2 bg-blue-100 p-3 rounded-xl hover:shadow-xl duration-300">
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
            { !tweet.isImage && <p>{ tweet.text}</p>}
            { tweet.isImage && <img src={`http://localhost:3000/user/profile/image/${tweet.text}`} className="w-1/2 mx-auto border-2 rounded-xl" />}
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