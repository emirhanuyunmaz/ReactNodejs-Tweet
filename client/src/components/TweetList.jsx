import { useEffect, useState } from "react";
import { useGetUserTweetLikeListQuery } from "../store/userApi/userApiSlicer";

import TweetCard from "./TweetCard";


export default function TweetList({tweetList}){

    const userTweetLikeList = useGetUserTweetLikeListQuery()
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
    
    
    return(<>
        {
            tweetList?.length >=0 && tweetList.map((tweet) => {
            return <TweetCard key={tweet._id} tweet={tweet} userTweetLike={userTweetLike} /> } )
        }

        {
            tweetList.length <= 0 && <p className="mx-auto text-2xl mt-10">Listelenecek Gönderi Yok </p>
        }
    </>)
}