import { useParams } from "react-router-dom"
import { useGetSingleTweetQuery, useGetUserTweetLikeListQuery, useTweetCommentListQuery, useTweetLikeMutation, useUserTweetAddCommentMutation, useUserTweetDislikeMutation } from "../store/userApi/userApiSlicer";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";


export default function SingleTweet(){
    const {id} = useParams()
    const {data,isLoading,error,isSuccess,isFetching} = useGetSingleTweetQuery(id)
    const userTweetLikeList = useGetUserTweetLikeListQuery()
    const [userLikeTweet , responseTweetLike] = useTweetLikeMutation()
    const [tweetDislike , responseTweetDislike] = useUserTweetDislikeMutation()
    const [addTweetComment,responseTweetAddComment] = useUserTweetAddCommentMutation()
    const tweetCommentList = useTweetCommentListQuery(id)
    const[userTweetLike,setUserTweetLike] = useState()
    const [tweet,setTweet] = useState({})
    const [text,setText] = useState("")
    const [commnets,setComments] = useState([])


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

    function getCommentList (){        
        setComments(tweetCommentList.data.data)
    }

    async function setLikeTweet(tweetId){
        const tweetLikeBody = {tweetId:tweetId} 
        await userLikeTweet(tweetLikeBody)
    }

    async function userTweetDislike(tweetId){        
        await tweetDislike({tweetId:tweetId})
    }

    async function addComment(){
        const body = {tweetId:id,text:text}
        addTweetComment(body)
        setText("")
    }

    async function getTweetLikeList(){
        if(userTweetLikeList.data.data === null){
            setUserTweetLike([])    
        }else{
            setUserTweetLike(userTweetLikeList?.data?.data?.tweetList)
        }
    }

    useEffect(() => {
        if(tweetCommentList.isSuccess){
            getCommentList()

        }
    },[tweetCommentList.isFetching,tweetCommentList.isSuccess])

    useEffect(() => {
        if(isSuccess){
            setTweet(data.data)
        }

    },[isSuccess,data,isFetching])


    useEffect(() => {
        if(userTweetLikeList.isSuccess){
            getTweetLikeList()
        }

    },[userTweetLikeList.isFetching,userTweetLikeList.isSuccess])
            
    return(<div className="w-3/4 mt-10 flex flex-col ">
                 
            {  tweet.userId  &&
            <div  className="flex flex-col mx-16 gap-3 border-2 bg-blue-100 p-3 rounded-xl hover:shadow-xl duration-300">
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
                    {   userTweetLike &&
                        userTweetLike.includes(tweet._id) ? (<button onClick={() => userTweetDislike(tweet._id)} className="flex gap-1 "><Heart  color="red" fill={`red`} /> {tweet.likes.length}</button> ):( <button onClick={()=>setLikeTweet(tweet._id)} className="flex gap-1 "><Heart /> {tweet.likes.length}</button>)
                    }
                    
                    <button className="flex gap-1 "><Repeat2 /></button>
                    <button onClick={(e) => CommentPage(tweet._id)} className="flex gap-1 "> <MessageCircle />{tweet.comments.length}</button>
                </div>
            </div>
            } 

            {/* Yeni Yorum Ekleme İşlemi */}
            <div className=" mt-5 flex  justify-center items-center gap-5">
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Yorum Yap" className="outline-none border-2 rounded-xl px-3 py-2 min-h-32 w-[50%] " />
                <button onClick={addComment} className="min-h-full px-8 py-2 bg-blue-300 rounded-xl hover:opacity-75 duration-300 " >Yorum Ekle</button>
            </div>

            {/* Yorum Listesi */}
            <div className="flex justify-center items-center mt-10 gap-3">

                {commnets.length !== 0 &&  <div className="w-[75%]  flex flex-col gap-3 p-3">
                        {
                            commnets.map((items) => {
                                return <div key={items._id} className="border-2 rounded-xl py-5" ><div  className="ms-3 flex gap-3">
                                <img src={`http://localhost:3000/user/profile/image/${items.userId.image}`} alt="" className="w-10 h-10 rounded-full" />
                                <div className="flex flex-col">
                                    <a href={`/user/${items.userId._id}`}>{items.userId.name} {items.userId.surname}</a>
                                    <p className="text-xs">{formatDate(items.createAt)}</p>
                                </div>
                            </div>
        
                            <div className="ms-10">
                                <p>{items.text}</p>
                            </div></div>
                            })
                        }
                    
                </div>}
            </div>
    </div>)
}