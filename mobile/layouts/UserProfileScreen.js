import { FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useCommentTweetPostListQuery, useGetTweetPostLikeListQuery, useGetUserShortProfileQuery, useUserTweetProfileQuery } from '../store/userApi/userApiSlicer'
import { useContactListQuery, useFollowUserMutation, useIsFollowUserQuery, useUnfollowUserMutation, useUserIsFollowRequestSentQuery } from '../store/contactApi/contactApiSlicer'
import { Settings } from 'lucide-react-native'
import { context } from '../context/context'
import TweetCommentList from '../components/TweetCommentList'

export default function UserProfileScreen() {

  const baseUrl = process.env.BASE_URL
  const user_context = useContext(context) 
  const navigation = useNavigation()
  const route = useRoute()
  const id = route.params?._id
  
  const [searchText,setSearchText] = useState("")
  const [selectNumber,setSelectNumber] = useState(0)

  let data = {
    id:id,
    text:searchText
  }

  const userTweetPostLikeList = useGetTweetPostLikeListQuery(data)
  const userTweetProfile = useUserTweetProfileQuery(data)
  const userCommentTweetList = useCommentTweetPostListQuery(data)
  const userShortProfile = useGetUserShortProfileQuery(id)
  const getContactList = useContactListQuery(id)
  const userIsFollow = useIsFollowUserQuery(id)
  const isFollowRequestSent = useUserIsFollowRequestSentQuery(id)
  const [contactUserUnfollow,responseContactUnfollow] = useUnfollowUserMutation()
  const [contactUserFollow,responseContactFollow] = useFollowUserMutation()

  const [userProfileData,setUserProfilData] = useState(null)
  const [contactListData,setContactListData] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [tweetList,setTweetList] = useState([])
  const [tweetCommentList,setTweetCommentList] = useState([])
  const [isUserProfile,setIsUserProfile] = useState(false)
  const [secretData,setSecretData] = useState(false)
  // console.log("USER FFLL:",userIsFollow.data.data) // Kullanıcı takip ediyor mu ?
  // console.log("SP:",userShortProfile.data?.data.profilePrivate) // Profil Gizli Mi ?
  
  function UserSettingScreen(){
    navigation.navigate("Settings")
  }

  function UserMessage(){
    navigation.navigate("Message",{_id:id})
  }

  function GoTo_UserFollowerListScreen(){
    navigation.navigate("UserFollowerList",{_id:id})
  }
  
  function GoTo_UserFollowedListScreen(){
    navigation.navigate("UserFollowedList",{_id:id})
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // setTweetList([])
    setSelectNumber(0)
    await userShortProfile.refetch()
    await getContactList.refetch()
    await userIsFollow.refetch()
    await isFollowRequestSent.refetch()
    await userTweetProfile.refetch() //Gönderi listesi
    await userTweetPostLikeList.refetch()
    await userCommentTweetList.refetch()
    // console.log("DATA::::",data.data);
        
    // setTweetList(data.data?.data)
    setRefreshing(false)
  }, [selectNumber]);

      // Kullanıcı takip isteği atma işlemi.
      async function UserFollowSocketOnClick(){
        try{
          console.log("TAKİP İSTEĞİ");
          await user_context.userFollowSocket(id,"follow")
          isFollowRequestSent.refetch()
        }catch(err){
          console.log("ERR:",err);
          
        }
        // location.reload()
    }

    // Kullanıcı takip isteği çekme işlemi.
    async function UserUnfollowSocketOnClick(){
        console.log("TAKİP Geri Çekme İSTEĞİ");
        await user_context.userUnfollowSocket(id,"unfollow")
        isFollowRequestSent.refetch()

        // location.reload()
    }
    
    // Kullanıcı Takipten çıkma işlemi
    async function UserUnfollowOnClick(){
      // console.log("Takipten çıkma işlemi.");
      
      try{
        const body={
          userId:id
        }
        await contactUserUnfollow(body)
        await onRefresh()
      }catch(Err){
        console.log("EEERR::",Err);
      }
    }

      // Takip etme işlemi için fonk.
      async function UserFollowOnClick(){
        
        try{
          const body={
            userId:id
          }
          await contactUserFollow(body)
          console.log("::ASDDSA::");
          await user_context.userDirectFollowSocket(id,"directFollow")
        }catch(err){
          console.log("ERR:",err);
          
        }
    }

    useFocusEffect(
      useCallback(() => {
        // console.log(userShortProfile.data?.data.profilePrivate);
        // console.log(userIsFollow.data?.data);
        
        if(userShortProfile.data?.data.profilePrivate == true && userIsFollow.data?.data == false  ){
          console.log("::GİZLİ::");
          setSecretData(true)
        }else{
          setSecretData(false)
        }

        onRefresh()
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
        };
      }, [])
    );

  useEffect(() => {
    if(userShortProfile.isSuccess){
      // console.log("AAUSER:",userShortProfile.data);
      
      setUserProfilData(userShortProfile.data.data)
    }
  },[userShortProfile.isSuccess,userShortProfile.isFetching])

  useEffect(() => {
    if(getContactList.isSuccess){
      setContactListData(getContactList.data)
    }
  },[getContactList.isSuccess,getContactList.isFetching])

  useEffect(() => {
    if(userTweetProfile.isSuccess && selectNumber == 0){
      data = {
          id:id,
          text:searchText
      }
      console.log("::AADDD::",data);

      setTweetList(userTweetProfile.data.data)
      setIsUserProfile(userTweetProfile.data.userProfile)
    }else if( userTweetPostLikeList.isSuccess && selectNumber == 1){
      data = {
        id:id,
        text:searchText
      }
      console.log("SADD:",userTweetPostLikeList.data.data);
      
      setTweetList(userTweetPostLikeList.data.data)
      setIsUserProfile(userTweetProfile.data.userProfile)
    }else if(userCommentTweetList.isSuccess && selectNumber == 2){
      data = {
        id:id,
        text:searchText
      }
      setTweetCommentList(userCommentTweetList.data.data)
      setIsUserProfile(userTweetProfile.data.userProfile)
    }


  },[userTweetProfile.isSuccess,userTweetProfile.isFetching,searchText,selectNumber,userCommentTweetList.isSuccess,userCommentTweetList.isFetching])

  useEffect(() => {

    if(userShortProfile.data?.data.profilePrivate &&  !userIsFollow.data?.data){
      console.log("Gönderileri gizle");
      setSecretData(true)
    }else{
      console.log("Gönderileri göster");
      setSecretData(false)
    }

  },[userIsFollow,userShortProfile])
  
  useEffect(() => {
    console.log("USER FOLLOW :",userIsFollow.data?.data?.profilePrivate);
    console.log("USER PRİVATE :",userShortProfile.data);
    
    if(userShortProfile.data?.data.profilePrivate == true && userIsFollow.data?.data == false ){
      console.log("::GİZLİ::");
      setSecretData(true)
    }else{
      setSecretData(false)
    }
  },[id])
  
  return (
    <View style={styles.container} >

              { !isUserProfile && secretData ?
                  <View>
                  <View style={styles.profileContainerStyle} >
                    <Image style={styles.imageStyle} source={{uri:`${baseUrl}/${userProfileData?.image}`}} />
                    
                    <View>
                      <Text style={styles.userNameTextStyle} >{userProfileData?.name} {userProfileData?.surname}</Text>
                      <Text>{userProfileData?.description}</Text>
                      
                      <TouchableOpacity onPress={GoTo_UserFollowerListScreen} style={styles.followButtonStyle} >
                        <Text style={styles.followButtonTextStyle} >{contactListData?.follower} Takipçi</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={GoTo_UserFollowedListScreen} style={styles.followButtonStyle} >
                        <Text style={styles.followButtonTextStyle} >{contactListData?.followed} Takip</Text>
                      </TouchableOpacity>

                    </View>

                    {!isUserProfile ? <View>

                      { userIsFollow.data?.data ? 
                        <TouchableOpacity style={styles.buttonStyle} >
                          <Text style={styles.buttonTextStyle} >Takipten Çık</Text>
                        </TouchableOpacity>
                          :
                          <View>
                        {  
                        userShortProfile.data?.data.profilePrivate ?
                            <View>
                              {
                                isFollowRequestSent.data?.data ?
                                <TouchableOpacity onPress={UserUnfollowSocketOnClick} style={styles.buttonStyle} >
                                <Text style={styles.buttonTextStyle} >İsteği Çek</Text>
                              </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={UserFollowSocketOnClick} style={styles.buttonStyle} >
                                  <Text style={styles.buttonTextStyle} >İstek At</Text>
                                </TouchableOpacity>
                              }
                            </View>
                              : 
                            <TouchableOpacity style={styles.buttonStyle} >
                              <Text style={styles.buttonTextStyle} >Takip Et</Text>
                            </TouchableOpacity>
                            
                            }
                        </View>
                      }
                      <TouchableOpacity onPress={UserMessage} style={styles.buttonStyle} >
                        <Text style={styles.buttonTextStyle} >Mesaj at</Text>
                      </TouchableOpacity>
                    </View>: <View>
                      <TouchableOpacity onPress={UserSettingScreen} style={styles.buttonStyle} >
                        <Text style={styles.buttonTextStyle} ><Settings size={32} color={"black"} /></Text>
                      </TouchableOpacity>
                    </View> }

                  </View>
                  <View>
                    <Text style={styles.infoStyle} >Profil Gizli</Text>
                  </View>
                </View>
                
                :

              <FlatList
                ListHeaderComponent={
                  <View>
                    <View style={styles.profileContainerStyle} >
                      <Image style={styles.imageStyle} source={{uri:`${baseUrl}/${userProfileData?.image}`}} />
                      
                      <View>
                        <Text style={styles.userNameTextStyle} >{userProfileData?.name} {userProfileData?.surname}</Text>
                        <Text>{userProfileData?.description}</Text>
                        
                        <TouchableOpacity onPress={GoTo_UserFollowerListScreen} style={styles.followButtonStyle} >
                          <Text style={styles.followButtonTextStyle} >{contactListData?.follower} Takipçi</Text>
                        </TouchableOpacity>
      
                        <TouchableOpacity onPress={GoTo_UserFollowedListScreen} style={styles.followButtonStyle} >
                          <Text style={styles.followButtonTextStyle} >{contactListData?.followed} Takip</Text>
                        </TouchableOpacity>
      
                      </View>
      
                      {!isUserProfile ? <View>

                        { userIsFollow.data?.data ? 
                          <TouchableOpacity onPress={UserUnfollowOnClick}  style={styles.buttonStyle} >
                            <Text style={styles.buttonTextStyle} >Takipten Çık</Text>
                          </TouchableOpacity>
                            :
                            <View>
                          {  
                          userShortProfile.data?.data.profilePrivate ? 
                              <TouchableOpacity onPress={UserFollowSocketOnClick} style={styles.buttonStyle} >
                                <Text style={styles.buttonTextStyle} >Takip İsteğ At</Text>
                              </TouchableOpacity>
                               : 
                              <TouchableOpacity onPress={UserFollowOnClick} style={styles.buttonStyle} >
                                <Text style={styles.buttonTextStyle} >Takip Et</Text>
                              </TouchableOpacity>
                              
                              }
                          </View>
                        }
                        <TouchableOpacity onPress={UserMessage} style={styles.buttonStyle} >
                          <Text style={styles.buttonTextStyle} >Mesaj at</Text>
                        </TouchableOpacity>
                      </View>: <View>
                        <TouchableOpacity onPress={UserSettingScreen} style={styles.buttonStyle} >
                          <Text style={styles.buttonTextStyle} ><Settings size={32} color={"black"} /></Text>
                        </TouchableOpacity>
                      </View> }
      
                    </View>
                    
                    <View style={styles.selectContainer}>

                      <TouchableOpacity onPress={() => setSelectNumber(0)} style={[selectNumber == 0 && styles.selectedButton]} >
                        <Text>Gönderiler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setSelectNumber(1)} style={[selectNumber == 1 && styles.selectedButton]}>
                        <Text>Beğeniler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setSelectNumber(2)} style={[selectNumber == 2 && styles.selectedButton]} >
                        <Text>Yorumlar</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer} >
                      <TextInput value={searchText} onChangeText={(e) => setSearchText(e)} style={styles.inputStyle} placeholder='Ara' />
                    </View>
                  </View>}
                    data={selectNumber != 2 ? tweetList : tweetCommentList}
                    style={{flex:1}}
                    ListEmptyComponent={<View style={{justifyContent:"center",alignItems:"center"}}><Text>Gönderi Bulunamadı</Text></View>}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({item}) => selectNumber != 2? <TweetCard {...item}  />:<TweetCommentList tweetCommentList={item} />}
                    keyExtractor={item => item._id}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  } 
                />
              }

    </View>

  )
}

const styles = StyleSheet.create({
  container:{
    // paddingBottom:120
    flex:1
  },
  profileContainerStyle:{
    backgroundColor:"#BFDBFF",
    paddingVertical:10,
    paddingHorizontal:32,
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    gap:10,
    // marginBottom:10,
    borderBottomColor:"black",
    borderBottomWidth:1
  },
  imageStyle:{
    width:128,
    height:128,
    borderRadius:100
  },
  userNameTextStyle:{
    fontSize:16,
    fontWeight:"700"
  },
  buttonStyle:{
    backgroundColor:"#60a5fa",
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:10,
    marginBottom:10
  },
  buttonTextStyle:{
    color:"white"
  },
  inputContainer:{
    marginBottom:10,
    paddingHorizontal:12,
    borderRadius:10
  },
  inputStyle:{
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    paddingHorizontal:10
  },
  followButtonTextStyle:{
    fontWeight:"700",
  },
  followButtonStyle:{
    marginVertical:5,
  },
  tweetContainer:{
    paddingBottom:256
  },
  infoStyle:{
    textAlign:"center",
    fontSize:24,
    fontWeight:"500"
  },
  selectContainer:{
    flexDirection:"row",
    backgroundColor:"#BFDBFF",
    gap:20,
    marginBottom:10,
    padding:10
  },
  selectedButton:{
    borderColor:"black",
    borderBottomWidth:2
  }
  

})