import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import MessageUserProfileCard from '../components/MessageUserProfileCard'
import { useGetUserMessageListQuery } from '../store/messageApi/messageApiSlicer'

export default function UserListScreen() {
  
  const getUserList = useGetUserMessageListQuery()
  
  console.log(getUserList.data?.data);
  const [refreshing, setRefreshing] = useState(false);
  

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      
      await getUserList.refetch()

      setRefreshing(false)
    }, []);

  return (
    <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle} >Mesaj</Text>
        </View>

        <View style={styles.userContainer} >
          <FlatList
            style={{flex:1}}
            data={getUserList.data?.data}
            renderItem={({item}) => <MessageUserProfileCard {...item} />}
            keyExtractor={item => item._id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
            
          />
          
        </View>
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
    paddingVertical:10,
    paddingHorizontal:10,
    marginBottom:10,

  },
  titleStyle:{
    fontSize:24,
    textAlign:"center",
    fontWeight:"bold"
  },  
  userContainer:{
    flex:1,
    marginHorizontal:10
  }
})