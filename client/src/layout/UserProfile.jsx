import { useContext, useEffect, useState } from "react";
import {  useParams } from "react-router-dom"
import { useCommentTweetPostListQuery, useGetTweetPostLikeListQuery, useGetUserShortProfileQuery,useUserTweetProfileQuery } from "../store/userApi/userApiSlicer";
import TweetList from "../components/TweetList";
import { useContactListQuery, useFollowUserMutation, useIsFollowUserQuery, useUnfollowUserMutation, useUserFollowedListQuery, useUserFollowerListQuery, useUserIsFollowRequestSentQuery } from "../store/contactApi/contactApiSlicer";
import ContactDialog from "../components/ContactDialog";
import { userContext } from "../context/userContext";
import TweetCommentList from "../components/TweetCommentList";


export default function UserProfile(){
    const params = useParams()
    // Kullanıcı id bilgisine göre safada gönderilerin görüntülenmesi işlemi.

    const [isUserProfile,setIsUserProfile] = useState(false)
    const [tweetList,setTweetList] = useState([])
    const [tweetCommentList,setTweetCommentList] = useState([])
    const [isProfile,setIsProfile] = useState(false)
    const [searchText,setSearchText] = useState("")
    const [userProfile,setUserProfile] = useState({})
    const [contactDialogControl,setContactDialogControl] = useState(false)
    const [contactUserList,setContactUserList] = useState([])  
    const [postIsShow,setPostIsShow] = useState(true)
    const [followRequest,setFollowRequest] = useState(false)
    const [selectNumber,setSelectNumber] = useState(0)
    let data = {
        id:params.id,
        text:searchText
    }
    
    const userTweetProfile = useUserTweetProfileQuery(data)
    const getTweetPostLikeList = useGetTweetPostLikeListQuery(data)
    const getCommentTweetPostListQuery = useCommentTweetPostListQuery(data)
    const userShortProfile = useGetUserShortProfileQuery(params.id)
    const [contactUserFollow,responseContactFollow] = useFollowUserMutation()
    const [contactUserUnfollow,responseContactUnfollow] = useUnfollowUserMutation()
    const getUserIsFollow = useIsFollowUserQuery(params.id)
    const contactList = useContactListQuery(params.id) 
    const getUserFollowerList = useUserFollowerListQuery(params.id) //takipçi listesi
    const getUserFollowedList = useUserFollowedListQuery(params.id) // Takip edilen listesi
    const isFollowRequestSent = useUserIsFollowRequestSentQuery(params.id)
    const context = useContext(userContext)


    function formatDateProfile(date) {
        let d =new Date(date)
        let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
        return datePart ;
    }

    // Kullanıcı takip isteği atma işlemi.
    async function UserFollowSocketOnClick(){
        console.log("TAKİP İSTEĞİ");
        await context.userFollowSocket(params.id,"follow")
        isFollowRequestSent.refetch()
        // location.reload()
    }

    // Kullanıcı takip isteği çekme işlemi.
    async function UserUnfollowSocketOnClick(){
        console.log("TAKİP Geri Çekme İSTEĞİ");
        await context.userUnfollowSocket(params.id,"unfollow")
        isFollowRequestSent.refetch()

        // location.reload()
    }

    function getShortProfile(){
        setUserProfile(userShortProfile.data.data)
    }

    // Takip etme işlemi için fonk.
    async function userFollowOnClick(){
        const body={
            userId:params.id
        }
        await contactUserFollow(body)
        await context.userDirectFollowSocket(params.id,"directFollow")
    }

    // Takipten çıkma işlemi
    async function userUnfollowOnClick(){
        const body={
            userId:params.id
        }
        await contactUserUnfollow(body)
        window.location.reload()
    }

    // Takipçi listesi çekilmesi işlemi.
    function getFollowerList(){
        // console.log(getUserFollowerList.data)
        setContactUserList(getUserFollowerList.data.data)
        setContactDialogControl(true)
    } 

    // Takip edilen listesi çekilmesi işlemi.
    function getFollowedList(){
        // console.log(getUserFollowedList.data)
        setContactUserList(getUserFollowedList.data.data)
        setContactDialogControl(true)
    } 

    useEffect(() => {
        if(userShortProfile.isSuccess){
            getShortProfile()
            console.log(userShortProfile.data.isUserProfile);
            
            setIsUserProfile(userShortProfile.data.isUserProfile)
        }
    },[userShortProfile.isSuccess,userShortProfile.isFetching])


    useEffect(() => {
        if(userTweetProfile.isSuccess && selectNumber == 0){
            data = {
                id:params.id,
                text:searchText
            }

            setTweetList(userTweetProfile.data.data)
            // console.log("SS:::SS",userTweetProfile.data.userProfile);
            setIsProfile(userTweetProfile.data.userProfile)
        }else if(getTweetPostLikeList.isSuccess && selectNumber == 1){
            data = {
                id:params.id,
                text:searchText
            }
            setTweetList(getTweetPostLikeList.data.data)
            setIsProfile(userTweetProfile.data.userProfile)

        }else if(getCommentTweetPostListQuery.isSuccess && selectNumber == 2){
            data = {
                id:params.id,
                text:searchText
            }
            setTweetCommentList(getCommentTweetPostListQuery.data.data)
            // console.log("ASDSDA:",getCommentTweetPostListQuery.data.data);
            
            setIsProfile(userTweetProfile.data.userProfile)
        }
    },[userTweetProfile.isFetching,userTweetProfile.isSuccess,getTweetPostLikeList.isFetching,getTweetPostLikeList.isSuccess,searchText,getCommentTweetPostListQuery.isSuccess,getCommentTweetPostListQuery.isFetching,selectNumber])

    useEffect(() => {
        // console.log("getUserIsFollow?.data?.data:",getUserIsFollow?.data?.data);
        // console.log("profilePrivate",profilePrivate);
        
        if((userShortProfile.isSuccess && getUserIsFollow.isSuccess && !userShortProfile.data.data.profilePrivate) || getUserIsFollow?.data?.data || userShortProfile.data?.isUserProfile ){
            // console.log(getUserIsFollow.data.data);
            console.log("Profili göster");
            setPostIsShow(true)
        }else{
            console.log("Profili gizle");
            setPostIsShow(false)
        }
    },[userShortProfile.isSuccess,userShortProfile.isFetching,getUserIsFollow.isFetching])
    

    useEffect(() => {
        if(isFollowRequestSent.isSuccess){
            // console.log("SA:",isFollowRequestSent.data);
            setFollowRequest(isFollowRequestSent.data.data)
        }
    },[isFollowRequestSent.isSuccess,isFollowRequestSent.isFetching])

    return (<div className=" w-full md:w-3/4 md:mx-auto mt-10">

        {/* Kullanıcı profili için temel yapı */}
        <div className="bg-blue-100 px-5 md:px-10 md:py-5 rounded-t-xl">
            <div className="flex flex-col justify-center items-center md:flex-row gap-3 md:gap-5" >
                <img className="w-32 h-32 rounded-full" src={`http://localhost:3000/${userProfile.image}`} alt="" />
                <div className="mt-5 flex flex-col gap-3">
                    <p className="font-bold" > {userProfile.name} {userProfile.surname}</p>
                    <p>{userProfile.description}</p>
                    <p>{formatDateProfile(userProfile.createdAt)}</p>
                    <div className="flex gap-10 justify-center mx-auto ">
                        <button onClick={getFollowerList} className="font-bold hover:underline">{contactList?.data?.follower ? contactList?.data?.follower : 0} takipçi</button>
                        
                        <button onClick={getFollowedList} className="font-bold hover:underline">{contactList?.data?.followed ? contactList?.data?.followed :0 } takip</button>
                    </div>
                </div>
                
                {!isProfile && <div className="md:ms-auto flex flex-col justify-center">
                    {!getUserIsFollow?.data?.data && postIsShow && <button onClick={userFollowOnClick} className="border-2 px-4 md:px-8 py-1 md:py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takip Et</button>}

                    {!getUserIsFollow?.data?.data && !postIsShow && !followRequest && <button onClick={UserFollowSocketOnClick} className="border-2 px-4 md:px-8 py-1 md:py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takip İsteği At</button>}

                    {!getUserIsFollow?.data?.data && !postIsShow && followRequest && <button onClick={UserUnfollowSocketOnClick} className="border-2 px-4 md:px-8 py-1 md:py-2 rounded-xl bg-blue-200 hover:bg-blue-400 hover:text-white duration-300 " >Takip İsteğini Çek</button>}

                    {getUserIsFollow?.data?.data && <button onClick={userUnfollowOnClick} className="border-2 px-4 md:px-8 py-1 md:py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takipten Çık</button>}

                    <a href={`/message/${params.id}`} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 text-center" >Mesaj At</a>
                </div>}
                {
                    isProfile &&<div className="mb-1 md:ms-auto flex flex-col justify-center"> <a href="/profile" className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Profili Düzenle</a></div>
                }
            </div>
        </div>
            {/* Tweet arama işlemi */}
            {postIsShow ? <><div className="flex flex-col justify-start items-start gap-3 ">
                <div className="flex gap-3 bg-blue-100 border-t-black border-t w-full p-3">
                    <button onClick={() => setSelectNumber(0)} className={`${selectNumber == 0 && "border-b-2 border-b-black"}`} >Gönderiler</button>
                    <button onClick={() => setSelectNumber(1)} className={`${selectNumber == 1 && "border-b-2 border-b-black"}`} >Beğeni</button>
                    <button onClick={() => setSelectNumber(2)} className={`${selectNumber == 2 && "border-b-2 border-b-black"}`} >Yorum</button>
                </div>
                <div className="flex  px-10 w-full">
                    <input onChange={(e) => setSearchText(e.target.value)} value={searchText} className="w-full  outline-none px-4 py-2 border-2 border-black  rounded-xl" type="text" placeholder="Tweet Ara"/>
                </div>

            </div>

            {/* Tweet List */}
            <div className="flex px-5 md:px-10 flex-col w-full gap-5 mt-3 pb-5">
                {selectNumber != 2 && <TweetList tweetList={tweetList} isUserProfile={isUserProfile}  />}
                {selectNumber == 2 && <TweetCommentList tweetCommentList={tweetCommentList} />}
            </div>
            <ContactDialog setShowModal={setContactDialogControl} showModal={contactDialogControl} userList={contactUserList} /></> : <p className="text-center mt-10 text-xl font-bold">Profil Gizlidir</p>}
    </div>)
}