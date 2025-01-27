import { useContext, useEffect, useState } from "react";
import {  useParams } from "react-router-dom"
import { useGetUserShortProfileQuery,useUserTweetProfileQuery } from "../store/userApi/userApiSlicer";
import TweetList from "../components/TweetList";
import { useContactListQuery, useFollowUserMutation, useIsFollowUserQuery, useUnfollowUserMutation, useUserFollowedListQuery, useUserFollowerListQuery, useUserIsFollowRequestSentQuery } from "../store/contactApi/contactApiSlicer";
import ContactDialog from "../components/ContactDialog";
import { userContext } from "../context/userContext";


export default function UserProfile(){
    const params = useParams()
    // Kullanıcı id bilgisine göre safada gönderilerin görüntülenmesi işlemi.
    // console.log(params.id);
    const [isUserProfile,setIsUserProfile] = useState(false)
    const [tweetList,setTweetList] = useState([])
    const [isProfile,setIsProfile] = useState(false)
    const [searchText,setSearchText] = useState("")
    const [userProfile,setUserProfile] = useState({})
    const [contactDialogControl,setContactDialogControl] = useState(false)
    const [contactUserList,setContactUserList] = useState([])  
    const [postIsShow,setPostIsShow] = useState(true)
    const [followRequest,setFollowRequest] = useState(false)
    let data = {
        id:params.id,
        text:searchText
    }
    console.log(params.id);
    
    const userTweetProfile = useUserTweetProfileQuery(data)
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

    // Kullanıcı takip isteği atma işlemi.
    async function UserUnfollowSocketOnClick(){
        console.log("TAKİP Geri Çekme İSTEĞİ");
        await context.userUnfollowSocket(params.id,"unfollow")
        isFollowRequestSent.refetch()

        // location.reload()
    }

    function getShortProfile(){
        // console.log("SSSS:AAA::A",userShortProfile.data.data.profilePrivate);
        // setProfilePrivate(userShortProfile.data.data.profilePrivate)
        // setProfilePrivate(userProfile.data.data.profilePrivate)
        setUserProfile(userShortProfile.data.data)
        // console.log("User Profile:",userShortProfile.data.data);
    }

    // Takip etme işlemi için fonk.
    async function userFollowOnClick(){
        const body={
            userId:params.id
        }
        await contactUserFollow(body)
    }

    // Takipten çıkma işlemi
    async function userUnfollowOnClick(){
        const body={
            userId:params.id
        }
        await contactUserUnfollow(body)
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
        if(userTweetProfile.isSuccess){
            data = {
                id:params.id,
                text:searchText
            }

            setTweetList(userTweetProfile.data.data)
            // console.log("SS:::SS",userTweetProfile.data.userProfile);
            setIsProfile(userTweetProfile.data.userProfile)
        }
    },[userTweetProfile.isFetching,userTweetProfile.isSuccess,searchText])

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

    return (<div className="md:w-3/4 md:mx-auto mt-10">

        {/* Kullanıcı profili için temel yapı */}
        <div className="bg-blue-100  md:px-10 py-5 rounded-xl">
            <div className="flex gap-5" >
                <img className="w-32 h-32 rounded-full" src={`${userProfile.image}`} alt="" />
                <div className="mt-5 flex flex-col gap-3">
                    <p className="font-bold" > {userProfile.name} {userProfile.surname}</p>
                    <p>{userProfile.description}</p>
                    <p>{formatDateProfile(userProfile.createdAt)}</p>
                </div>
                <div className="flex flex-col justify-center mx-auto ">
                    <button onClick={getFollowerList} className="font-bold hover:underline">{contactList?.data?.follower ? contactList?.data?.follower : 0} takipçi</button>
                    <button onClick={getFollowedList} className="font-bold hover:underline">{contactList?.data?.followed ? contactList?.data?.followed :0 } takip</button>
                </div>
                {!isProfile && <div className="ms-auto flex flex-col justify-center">
                    {!getUserIsFollow?.data?.data && postIsShow && <button onClick={userFollowOnClick} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takip Et</button>}

                    {!getUserIsFollow?.data?.data && !postIsShow && !followRequest && <button onClick={UserFollowSocketOnClick} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takip İsteği At</button>}

                    {!getUserIsFollow?.data?.data && !postIsShow && followRequest && <button onClick={UserUnfollowSocketOnClick} className="border-2 px-8 py-2 rounded-xl bg-blue-200 hover:bg-blue-400 hover:text-white duration-300 " >Takip İsteğini Çek</button>}

                    {getUserIsFollow?.data?.data && <button onClick={userUnfollowOnClick} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Takipten Çık</button>}

                    <a href={`/message/${params.id}`} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 text-center" >Mesaj At</a>
                </div>}
                {
                    isProfile &&<div className="ms-auto flex flex-col justify-center"> <a href="/profile" className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Profili Düzenle</a></div>
                }
            </div>
        </div>
            {/* Tweet arama işlemi */}
            {postIsShow ? <><div className="flex  justify-start items-center gap-3 ms-10 mt-3">
                <input onChange={(e) => setSearchText(e.target.value)} value={searchText} className="w-1/2 outline-none px-4 py-2 border-2 border-black  rounded-xl" type="text" placeholder="Tweet Ara"/>
                {/* <button onClick={(e) => searchTweetUser(e)} className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300 " >Ara</button> */}
            </div>

            {/* Tweet List */}
            <div className="flex px-5 md:px-10 flex-col w-full gap-5 mt-3 pb-5">
                <TweetList tweetList={tweetList} isUserProfile={isUserProfile}  />
            </div>
            <ContactDialog setShowModal={setContactDialogControl} showModal={contactDialogControl} userList={contactUserList} /></> : <p className="text-center mt-10 text-xl font-bold">Profil Gizlidir</p>}
    </div>)
}