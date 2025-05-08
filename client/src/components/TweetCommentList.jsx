import { useEffect, useState } from "react";
import { useGetUserTweetLikeListQuery } from "../store/userApi/userApiSlicer";
import TweetCard from "./TweetCard";
import { CornerDownRight } from "lucide-react";


export default function TweetCommentList({tweetCommentList}){
    const userTweetLikeList = useGetUserTweetLikeListQuery()

    console.log("TWEET COMMENT",tweetCommentList);

    const [userTweetLike,setUserTweetLike] = useState([])

    async function getTweetLikeList(){
        if(userTweetLikeList.data.data === null){
            setUserTweetLike([])    
        }else{
            setUserTweetLike(userTweetLikeList?.data?.data?.tweetList)
        }
    }

    

    useEffect(() => {
        if(userTweetLikeList.isSuccess){
            getTweetLikeList()
        }

    },[userTweetLikeList.isFetching,userTweetLikeList.isSuccess])
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
    

    return (<>
        {tweetCommentList.length != 0 ? 
        <>

        {tweetCommentList.map((tweetComment) => {

            return <div key={tweetComment._id} className="relative flex flex-col gap-5">
                <div className="">
                    <TweetCard isUserProfile={false} userTweetLike={userTweetLike} tweet={tweetComment.tweet} />
                </div>
                <div className="flex gap-3">
                    <div className=" flex justify-end items-center w-1/4">
                        <CornerDownRight />
                    </div>
                    <div className="flex flex-col w-3/4  bg-blue-200 p-3 rounded-xl">
                        <div className="flex gap-3">
                            <img className="w-10 h-10 rounded-full" src={`http://localhost:3000/${tweetComment.userId.image}`} alt="" />
                            <div className="flex flex-col">
                                <a href={`/user/${tweetComment.userId._id}`}>{tweetComment.userId.name}  {tweetComment.userId.surname}</a>
                                <p className="text-xs">{formatDate(tweetComment.createAt)}</p>
                            </div>
                        </div>
                        <div className="flex ms-16">
                            
                            <p>{tweetComment.text}</p>

                        </div>
                    </div>
                </div>
            
            </div>

        })}</>
        :
        <p>Gönderi Bulunamadı</p>

    }

    </>)
} 