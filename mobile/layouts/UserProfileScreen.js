import { FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useGetUserShortProfileQuery, useUserTweetProfileQuery } from '../store/userApi/userApiSlicer'
import { useContactListQuery } from '../store/contactApi/contactApiSlicer'
import { Settings } from 'lucide-react-native'

export default function UserProfileScreen() {

  const baseUrl = process.env.BASE_URL

  const navigation = useNavigation()
  const route = useRoute()
  const id = route.params?._id
  
  const [searchText,setSearchText] = useState("")
  let data = {
    id:id,
    text:searchText
  }

  const userShortProfile = useGetUserShortProfileQuery(id)
  const getContactList = useContactListQuery(id)
  const userTweetProfile = useUserTweetProfileQuery(data)

  const [userProfileData,setUserProfilData] = useState(null)
  const [contactListData,setContactListData] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [tweetList,setTweetList] = useState([])
  const [isUserProfile,setIsUserProfile] = useState(false)

  function UserSettingScreen(){
    navigation.navigate("Settings")
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTweetList([])
    await userShortProfile.refetch()
    await getContactList.refetch()
    const data = await userTweetProfile.refetch()
    setTweetList(data.data.data)
    setRefreshing(false)
  }, []);


    useFocusEffect(
      useCallback(() => {
        // Do something when the screen is focused
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
    if(userTweetProfile.isSuccess){
      data = {
          id:id,
          text:searchText
      }
      // console.log("::AADDD::",userTweetProfile.data);

      setTweetList(userTweetProfile.data.data)
      setIsUserProfile(userTweetProfile.data.userProfile)
    }
  },[userTweetProfile.isSuccess,userTweetProfile.isFetching,searchText])


  return (
    <View style={styles.container} >

              <FlatList
                ListHeaderComponent={
                  <View>
                    <View style={styles.profileContainerStyle} >
                      <Image style={styles.imageStyle} source={{uri:`${baseUrl}/${userProfileData?.image}`}} />
                      
                      <View>
                        <Text style={styles.userNameTextStyle} >{userProfileData?.name} {userProfileData?.surname}</Text>
                        <Text>{userProfileData?.description}</Text>
                        
                        <TouchableOpacity style={styles.followButtonStyle} >
                          <Text style={styles.followButtonTextStyle} >{contactListData?.follower} Takipçi</Text>
                        </TouchableOpacity>
      
                        <TouchableOpacity style={styles.followButtonStyle} >
                          <Text style={styles.followButtonTextStyle} >{contactListData?.followed} Takip</Text>
                        </TouchableOpacity>
      
                      </View>
      
                      {!isUserProfile ? <View>
                        <TouchableOpacity style={styles.buttonStyle} >
                          <Text style={styles.buttonTextStyle} >İstek At</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonStyle} >
                          <Text style={styles.buttonTextStyle} >Mesaj at</Text>
                        </TouchableOpacity>
                      </View>: <View>
                        <TouchableOpacity onPress={UserSettingScreen} style={styles.buttonStyle} >
                          <Text style={styles.buttonTextStyle} ><Settings size={32} color={"black"} /></Text>
                        </TouchableOpacity>
                      </View> }
      
                    </View>
                    
                    <View style={styles.inputContainer} >
                      <TextInput value={searchText} onChangeText={(e) => setSearchText(e)} style={styles.inputStyle} placeholder='Ara' />
                    </View>
                  </View>}
                  data={tweetList}
                  style={{flex:1}}
                  contentContainerStyle={{ paddingBottom: 20 }}

                  renderItem={({item}) => <TweetCard {...item} />}
                  keyExtractor={item => item._id}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  } 
                />
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
    marginBottom:10,
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
  }

})