import {  useContext, useEffect, useState } from "react";
import { useGetTagListQuery, useGetTweetListQuery, useGetUserProfileQuery, useGetUserTagListQuery} from "../store/userApi/userApiSlicer";
import TweetDialog from "../components/TweetDialog";
import TweetList from "../components/TweetList";
import TagsCard from "../components/TagsCard";
import { userContext } from "../context/userContext";
// import RetweetDialog from "../components/RetweetDialog";

export default function Tweet(){

    const {data,isLoading,isError,isSuccess,isFetching} = useGetTweetListQuery()
    const getuserP = useGetUserProfileQuery()
    const getUserTagList = useGetUserTagListQuery()
    const getTagList = useGetTagListQuery()
    const [tweetList,setTweetList] = useState([])
    const [userProfile,setUserProfile] = useState({})
    const [tagList,setTagList] = useState([])
    const [showTweetDialog,setShowTweetDialog] = useState(false)
    const [userTags,setUserTags] = useState([])
    let {token,logout} = useContext(userContext) 

    async function getUserProfile(){
        setUserProfile(getuserP.data)
    }

    async function getTweetList(){
        setTweetList(data.tweetList)
    }


    function getTags(){        
        setTagList(getTagList.data.data)
    }

    useEffect(() => {
        if(isSuccess){
            getTweetList()
        }
    },[isLoading,isError,isSuccess,isFetching])

    useEffect(() => {
        if(getuserP.isSuccess){
            getUserProfile()
        }
    },[getuserP])

    useEffect(() => {
        if(getTagList.isSuccess){
            getTags()
        }
    },[getTagList.isSuccess,getTagList.isFetching])

    useEffect(() => {
        if(getUserTagList.isSuccess){
            // console.log(getUserTagList.data);
            setUserTags(getUserTagList.data.data)
        }
    },[getUserTagList.isSuccess,getUserTagList.isFetching])

    return(
    <div className="flex w-full md:min-h-[90vh] justify-center ">
        {/* USER PROFILE */}
        <div className="bg-blue-200 max-h-[75vh] rounded-xl hidden md:flex md:w-1/6 mt-5">
            <div className="w-full flex flex-col items-center" >
                <img className="w-1/2 mt-5 rounded-full" src={`http://localhost:3000/user/profile/image/${userProfile.image}`} alt="" />

                <p>{userProfile.name} {userProfile.surname}</p>

                <div className="mt-5 flex flex-col gap-3">
                    <a className="border-2 px-8 py-2 rounded-xl hover:bg-blue-400 hover:text-white duration-300 " href={`/user/${userProfile._id}`}>Profile</a>
                    
                    <button onClick={() => setShowTweetDialog(true)} className="border-2 px-8 py-2 rounded-xl hover:bg-blue-400 hover:text-white duration-300 " >Tweet At</button>

                    <a className="border-2 px-8 py-2 rounded-xl hover:bg-blue-400 hover:text-white duration-300 " href={`/profile`}>Ayarlar</a>
                    
                    <button onClick={logout} className="border-2 px-8 py-2 rounded-xl hover:bg-blue-400 hover:text-white duration-300 " >Çıkış Yap</button>

                </div>
            </div>

        </div>


        <div className="flex flex-col-reverse md:flex-row w-full md:w-3/4 mt-5 md:mt-0 md:gap-3">
            <div className="flex flex-col mt-5 md:mt-0 w-full  md:p-5">
                
                {/* TWEET LIST */}
                <div className="flex flex-col gap-5 mx-5 md:mx-10">
                    <TweetList tweetList={tweetList} />
                </div>
            </div>
            
            <div className="flex flex-col w-full  md:w-1/4 px-16 md:px-0 md:p-5">
                
                {/* Duygular */}
                <TagsCard tagList={tagList} />

                {/* Etiketler */}
                <div className="bg-blue-100 p-5 rounded-xl mt-5 ">
                    <h3 className="font-bold">Etiketler</h3>
                    <div className="ms-5 mt-3 mx-3">
                        {userTags.length !== 0 && <ul className="flex flex-col gap-3">
                            {
                                userTags.map((userTag) => {
                                    return <li key={userTag._id} className=""><a href={`/userTag/${userTag._id}`} className="border-b-2 hover:border-b-white flex justify-between"><p className="font-bold">#{userTag._id} :</p><p>{userTag.count}</p></a></li>
                                })
                            }
                            
                        </ul>}
                    </div>
                </div>

            </div>
        </div>
        <TweetDialog setShowModal={setShowTweetDialog} showModal={showTweetDialog}/>
    </div>)
}