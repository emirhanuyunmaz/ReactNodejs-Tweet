import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import { FloatingAction } from "react-native-floating-action";
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetTweetListQuery } from '../store/userApi/userApiSlicer';

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
  
  const [tweetList,setTweetList] = useState([])

  const getTweetList = useGetTweetListQuery({tweetFollowedData : false})



  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  useEffect(() => {
    if(getTweetList.isSuccess){
      console.log(getTweetList.data.tweetList);
      
      setTweetList(getTweetList.data.tweetList)
    }

  },[getTweetList.isSuccess,getTweetList.isFetching])

  return (
    <View style={styles.container} >
    {/* <ScrollView  > */}
   

      <View style={styles.selectContainerStyle} >
        <TouchableOpacity style={styles.selectStyle} >
          <Text style={styles.selectTextStyle} >Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.selectStyle,styles.selectedStyle]} >
          <Text style={styles.selectTextStyle} >Takip Edilenler</Text>
        </TouchableOpacity>

      </View>
      {/* <ScrollView style={styles.tweetContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} > */}
        {tweetList.length > 0 && 
        
        <FlatList
          data={tweetList}
          renderItem={({item}) => <TweetCard {...item} />}
          keyExtractor={item => item._id}
        />
        
        
        }  
        
        
      {/* </ScrollView> */}
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
    {/* </ScrollView> */}
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
  }
})