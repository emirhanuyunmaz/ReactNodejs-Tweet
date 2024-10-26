import { useParams } from "react-router-dom"
import { useGetSingleTweetQuery, useGetUserTweetLikeListQuery, useTweetCommentListQuery, useUserTweetAddCommentMutation } from "../store/userApi/userApiSlicer";
import { useEffect, useState } from "react";
import TweetCard from "../components/TweetCard";
import TweetCommentCard from "../components/TweetCommentCard";
import TagsCard from "../components/TagsCard";


export default function SingleTweet(){
    const {id} = useParams()
    const {data,isLoading,error,isSuccess,isFetching} = useGetSingleTweetQuery(id)
    const userTweetLikeList = useGetUserTweetLikeListQuery()
    const [addTweetComment,responseTweetAddComment] = useUserTweetAddCommentMutation()
    const tweetCommentList = useTweetCommentListQuery(id)
    const[userTweetLike,setUserTweetLike] = useState([])
    const [tweet,setTweet] = useState({})
    const [text,setText] = useState("")
    const [commnets,setComments] = useState([])
    const [tagList,setTagList] = useState([])

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
        console.log(tweetCommentList.data.commentTagList);
        setTagList(tweetCommentList.data.commentTagList)
        setComments(tweetCommentList.data.data)
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
            
    return(<div className="flex  mt-10">
                 
            <div className="w-3/4 flex flex-col">
                {  tweet.userId && userTweetLike  && <TweetCard tweet={tweet} userTweetLike={userTweetLike} /> } 

                {/* Yeni Yorum Ekleme İşlemi */}
                <div className=" mt-5 flex ms-20 justify-start items-center gap-5">
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Yorum Yap" className="outline-none border-2 rounded-xl px-3 py-2 min-h-32 w-[50%] " />
                    <div>
                        <button onClick={addComment} className=" min-h-full px-8 py-2 bg-blue-300 rounded-xl hover:bg-blue-400 hover:text-white duration-300 " >Yorum Ekle</button>
                    </div>
                </div>

                {/* Yorum Listesi */}
                <div className="flex justify-start items-center ms-20 mt-10 gap-3">

                    {commnets.length !== 0 &&  <div className="w-[75%]  flex flex-col gap-3 p-3">
                            {
                                commnets.map((items) => {
                                    return <TweetCommentCard key={items._id} items={items} />
                                })
                            }
                        
                    </div>}
                </div>
            </div>

            <div className="w-1/4 mx-10">
                {<TagsCard tagList={tagList} />}
            </div>
    </div>)
}