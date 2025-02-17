import {  RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import ClassificationTagList from '../components/ClassificationTagList'
import CommentCard from '../components/CommentCard'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetSingleTweetQuery, useTweetCommentListQuery } from '../store/userApi/userApiSlicer'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Plus } from 'lucide-react-native'
import { FloatingAction } from 'react-native-floating-action'

const actions = [
  {
    text: "Tweet Yorum Ekle",
    icon: <Plus size={22} color={"black"} />,
    name: "fab_add_comment",
    position: 1
  },
  
];

export default function SingleTweetScreen() {

  const route = useRoute()  
  const navigation = useNavigation()
  const id = route.params?._id // Gelen veriyi yakalama işlemi.
  
  const [tweetData,setTweetData] = useState(null)
  const [commnets,setComments] = useState([])
  const [tagList,setTagList] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const getSingleTweet = useGetSingleTweetQuery(id)
  const getCommentList = useTweetCommentListQuery(id)
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
    await getSingleTweet.refetch()
    await getCommentList.refetch()

    setRefreshing(false)
  }, []);
  
  function commentScreen(){
    navigation.navigate("Comment",{_id:id})
  }



  useEffect(() => {
    if(getSingleTweet.isSuccess){       
      setTweetData(getSingleTweet.data.data)
    }
  },[getSingleTweet.isSuccess,getSingleTweet.isFetching])

  useEffect(() => {
    if(getCommentList.isSuccess){
      setComments(getCommentList.data.data)
      console.log(getCommentList.data.data);
      
      setTagList(getCommentList.data.commentTagList)
    }
  },[getCommentList.isSuccess,getCommentList.isFetching])

  return (
    <SafeAreaProvider style={{flex:1}} >
      <SafeAreaView style={{flex:1}} >
      <ScrollView contentContainerStyle={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
        <View style={styles.container} >
          <View>
            <ClassificationTagList tagList={tagList} />
          </View>
          
          {tweetData != null && <TweetCard {...tweetData} />}

          <Text style={styles.commentTitleStyle} >Yorumlar</Text>
          <View>
            {commnets.length != 0 && 
              commnets.map((item) => <CommentCard key={item._id} {...item} />)
            }
            
            
          </View>


        </View>

        <FloatingAction
            actions={actions}
            onPressItem={name => {
              if( name == "fab_add_comment"){
                // console.log("ADD");
                commentScreen()
              }
            }}
        />
      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:10
  },
  scrollView:{
    flex:1
  },
  inputContainer:{

  },
  commentTitleStyle:{
    marginHorizontal:10,
    fontSize:20,
    fontWeight:"500",
    marginTop:10
  },
  inputStyle:{
    borderWidth:2,
    borderColor:"gray",
    marginHorizontal:10,
    borderRadius:10,
    paddingHorizontal:10,
    textAlignVertical:"top",
    height:120,
    marginTop:10
  },
  buttonStyle:{
    backgroundColor:"#BFDBFF",
    paddingVertical:10,
    marginHorizontal:10,
    borderRadius:10,
    marginTop:10
  },
  buttonTextStyle:{
    textAlign:"center"
  }
})