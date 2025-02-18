import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import { useRoute } from '@react-navigation/native'
import { useGetUserShortProfileQuery, useUserTweetProfileQuery } from '../store/userApi/userApiSlicer'
import { useContactListQuery } from '../store/contactApi/contactApiSlicer'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function UserProfileScreen() {

  const baseUrl = process.env.BASE_URL

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    await userShortProfile.refetch()
    await getContactList.refetch()
    await userTweetProfile.refetch(data)

    setRefreshing(false)
  }, []);


  useEffect(() => {
    if(userShortProfile.isSuccess){
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
      console.log(userTweetProfile.data);
      setTweetList(userTweetProfile.data.data)
      setIsUserProfile(userTweetProfile.data.userProfile)
    }
  },[userTweetProfile.isSuccess,userTweetProfile.isFetching,searchText])


  return (
    <View style={styles.container} >

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
                <TouchableOpacity style={styles.buttonStyle} >
                  <Text style={styles.buttonTextStyle} >Profili Düzenle</Text>
                </TouchableOpacity>
              </View> }

            </View>
            
            <View style={styles.inputContainer} >
              <TextInput value={searchText} onChangeText={(e) => setSearchText(e)} style={styles.inputStyle} placeholder='Ara' />
            </View>
            <View style={{flex:1}} >
              <FlatList
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
    paddingHorizontal:24,
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    gap:10,
    marginBottom:10
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