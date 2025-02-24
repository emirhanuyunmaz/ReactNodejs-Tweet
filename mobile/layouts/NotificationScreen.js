import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import NotificationCard from '../components/NotificationCard'
import {io} from "socket.io-client"
import { context } from '../context/context'
import { useNotificationShowedMutation, useUserNotificationLengthQuery, useUserNotificationListQuery } from '../store/contactApi/contactApiSlicer'
import { useFocusEffect } from '@react-navigation/native'

export default function NotificationScreen() {
  const baseUrl = process.env.BASE_URL
  const user_context = useContext(context)
  
  const [socket,setSocket] = useState(null)
  const [data,setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  
  // const [notificationLength,setNotificationLength] = useState(0)
  const getAllNotification = useUserNotificationListQuery()
  const getUserNotificationLength = useUserNotificationLengthQuery()
  const [notificationShowed,resNotificationShowed] = useNotificationShowedMutation()

  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    await getAllNotification.refetch()
    // const newData = await getAllMessage.refetch()
    // user_context.setMessageList([])
    // setMessageList(newData.data?.data)
    // await notificationShowed()
    // user_context.setNotificationLength(0)
    setRefreshing(false)
    
  }, []);

    useFocusEffect(
      useCallback( () => {
        // user_context.connectSocket(id)
        // connectSocket()
        
        onRefresh()
        notificationShowed()
        user_context.setNotificationLength(0)
        return () => {
          // if(socket != null){
          //   // socket.disconnect()

          // }
        };
      }, [])
    );
  
  useEffect(() => {
    if(getUserNotificationLength.isSuccess){
      user_context.setNotificationLength(getUserNotificationLength.data.data)
    }
  },[getUserNotificationLength.isSuccess,getUserNotificationLength.isFetching])

  useEffect(() => {

    if(getAllNotification.isSuccess){
      // console.log("BİLDİRİMLER:",);
      // console.log(getAllNotification.data);
      setData(getAllNotification.data.data);
     
    }

  },[getAllNotification.isSuccess,getAllNotification.isFetching])

  useEffect(() => {
    onRefresh()
  },[user_context.notificationLength])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer} >
        <Text style={styles.titleStyle} >Bildirimler</Text>
      </View>
        {data.length != 0 ? 
        <FlatList
          style={{flex:1}}
          // inverted={true}
          data={data}
          renderItem={({item}) => <NotificationCard {...item} refetch={onRefresh} />}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } 
        /> : <Text style={{textAlign:"center",fontSize:20 , marginTop:10,fontWeight:"500"}} >Herhangi Bir Bildirim Yok</Text>}
        {/* <NotificationCard />  */}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:24, 
    flex:1
  },
  titleContainer:{
    backgroundColor:"#BFDBFF",
    
  },
  titleStyle:{
    fontSize:24,
    fontWeight:"bold",
    paddingVertical:10,
    textAlign:"center"
  }

})