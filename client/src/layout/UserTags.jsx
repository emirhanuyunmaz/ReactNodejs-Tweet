import { useParams } from "react-router-dom"
import { useGetSingleUserTagQuery} from "../store/userApi/userApiSlicer"
import { useEffect, useState } from "react"
import TweetList from "../components/TweetList"


export default function UserTags(){
    // Bir etiket ile yapılat tweetler. 
    const {tag} = useParams()
    const userTag = useGetSingleUserTagQuery(tag)
    const [tweetList,setTweetList] = useState([])




    useEffect(() => {
        if(userTag.isSuccess){
            console.log(userTag.data);
            setTweetList(userTag.data.data)
        }
    },[userTag.isSuccess,userTag.isFetching])
    

    return(<div className="flex flex-col gap-3 mt-10 w-3/4">
        <TweetList tweetList={tweetList} />
        
    </div>)
}