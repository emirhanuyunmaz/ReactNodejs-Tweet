import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import { FloatingAction } from "react-native-floating-action";
import { Plus } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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

  const [loading,setLoading] = useState(false)
  const [tweetList,setTweetList] = useState([])

  const {isFetching,refetch,data,isSuccess} = useGetTweetListQuery({is_followed_data : followedTweet})

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTweetList([])
    setLoading(true)
    const newData = await refetch()
    // console.log("DATA::",newData.data);
    
    setTweetList(newData.data.tweetList)
    setRefreshing(false)
    setLoading(false)
  }, []);

  async function getUserTweetListControl(){
    const item = await AsyncStorage.getItem("followedTweet")
    setFollowedTweet(item ? item :false)
    await refetch()
  }

  async function globalTweetData(){
    await AsyncStorage.removeItem("followedTweet")
    setFollowedTweet(false)    
    await refetch()
  }
  
  async function followedTweetData(){
    await AsyncStorage.setItem("followedTweet","true")
    setFollowedTweet(true)
    await refetch()
  }

  useEffect(() => {
    
    if(isSuccess){
      // console.log("TEKRAR ÇEKİM",data );
      setTweetList(data.tweetList)
    }

  },[data])

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
    getUserTweetListControl()
  },[])

    

  return (
    <View style={styles.container} >   

      
        {
          loading ?  <Text style={{textAlign:"center" ,fontSize:16,fontWeight:"500",marginTop:16}} >Yükleniyor...</Text> :
            
            <FlatList
            ListHeaderComponent={<View style={styles.selectContainerStyle} >
            <TouchableOpacity onPress={globalTweetData} style={[styles.selectStyle,!followedTweet && styles.selectedStyle ]} >
              <Text style={styles.selectTextStyle} >Global</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={followedTweetData} style={[styles.selectStyle,followedTweet && styles.selectedStyle]} >
              <Text style={styles.selectTextStyle} >Takip Edilenler</Text>
            </TouchableOpacity>
          </View>}
            ListEmptyComponent={<Text style={styles.infoStyle} >Gönderi Bulunamadı</Text>}
            data={tweetList}
            renderItem={({item}) => <TweetCard {...item} />}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } 
            />
            
        
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