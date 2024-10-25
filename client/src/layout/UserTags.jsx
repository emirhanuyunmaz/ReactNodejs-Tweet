import { useParams } from "react-router-dom"
import { useGetSingleUserTagQuery} from "../store/userApi/userApiSlicer"
import { useEffect, useState } from "react"
import TweetList from "../components/TweetList"
import TagsCard from "../components/TagsCard"


export default function UserTags(){
    // Bir etiket ile yapılat tweetler. 
    const {tag} = useParams()
    const userTag = useGetSingleUserTagQuery(tag)
    const [tweetList,setTweetList] = useState([])
    const [tagList,setTagList] = useState([]) 



    useEffect(() => {
        if(userTag.isSuccess){
            console.log(userTag.data);
            setTweetList(userTag.data.data)
            setTagList(userTag.data.tagData)
        }
    },[userTag.isSuccess,userTag.isFetching])
    

    return(<div className="flex mt-10 mx-10">
        <div className="flex flex-col gap-3  w-3/4">
            <TweetList tweetList={tweetList} />
        </div>
        <div className="w-1/4">
            <TagsCard tagList={tagList} />
        </div>
    </div>)
}