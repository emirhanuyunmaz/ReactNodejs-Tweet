import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import { FloatingAction } from "react-native-floating-action";
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetTweetListQuery } from '../store/userApi/userApiSlicer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const actions = [
  {
    text: "Tweet Ekle",
    icon: <Plus size={22} color={"black"} />,
    name: "fab_add",
    position: 1
  },
  
];

export default function HomeScreen() {
  
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false);
  const [followedTweet,setFollowedTweet] = useState(true)

  const [tweetList,setTweetList] = useState([])

  const getTweetList = useGetTweetListQuery({is_followed_data : followedTweet})

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getTweetList.refetch().unwrap().then(() => {
      setRefreshing(false)
    })
  }, []);

  async function getUserTweetListControl(){
    const item = await AsyncStorage.getItem("followedTweet")
    setFollowedTweet(item ? item :false)
    getTweetList.refetch()
  }

  async function globalTweetData(){
    await AsyncStorage.removeItem("followedTweet")
    setFollowedTweet(false)    
    getTweetList.refetch()
  }
  
  async function followedTweetData(){
    await AsyncStorage.setItem("followedTweet","true")
    setFollowedTweet(true)
    getTweetList.refetch()
  }

  useEffect(() => {
    
    if(getTweetList.isSuccess){
      setTweetList(getTweetList.data.tweetList)
    }

  },[getTweetList.isSuccess,getTweetList.isFetching,getTweetList.data])

  useEffect(() => {
    getUserTweetListControl()
  },[])

  return (
    <View style={styles.container} >   

      <View style={styles.selectContainerStyle} >
        <TouchableOpacity onPress={globalTweetData} style={[styles.selectStyle,!followedTweet && styles.selectedStyle ]} >
          <Text style={styles.selectTextStyle} >Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={followedTweetData} style={[styles.selectStyle,followedTweet && styles.selectedStyle]} >
          <Text style={styles.selectTextStyle} >Takip Edilenler</Text>
        </TouchableOpacity>

      </View>

        {tweetList.length > 0 ? 
        
        <FlatList
          data={tweetList}
          renderItem={({item}) => <TweetCard {...item} />}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } 
          />:<Text style={styles.infoStyle} >Gönderi Bulunamadı</Text>
        }  
        
        
      <View style={styles.floatActionButton} >

        <FloatingAction
          actions={actions}
          onPressItem={name => {
            if( name == "fab_add"){
              // console.log("ADD");
              navigation.navigate("AddTweet")
            }
          }}
        />

      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    
    marginTop:22,
    // backgroundColor:"red"
  },
  tweetContainer:{
    flexDirection:"column",
    
  },
  selectContainerStyle:{
    flexDirection:"row",
    gap:10,
    marginBottom:10,
    backgroundColor:"#BFDBFF",
    
  },
  selectStyle:{
    flex:1,
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:10
  },
  selectTextStyle:{
    textAlign:"center"
  },
  selectedStyle:{
    borderBottomColor:"black",
    borderBottomWidth:3
  },
  floatActionButton:{
    position:"absolute",
    bottom:0,
    right:0
  },
  infoStyle:{
    textAlign:"center",
    fontSize:24
  }
})