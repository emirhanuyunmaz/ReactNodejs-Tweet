import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import TaskCard from '../components/TaskCard'
import { useGetTaskListQuery } from '../store/userApi/userApiSlicer'
import { useFocusEffect } from '@react-navigation/native'

export default function TaskListScreen() {

  const taskList = useGetTaskListQuery()
  const [refreshing, setRefreshing] = useState(false);

  console.log(taskList.data);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await taskList.refetch()
    // console.log("DATA::",newData.data);
    

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

  return (
    <View style={styles.container} >
      <Text>TaskListScreen</Text>
      <View style={styles.taskListContainerStyle}>
        <FlatList
          style={{flex:1,gap:10}}
          numColumns={2}
          data={taskList.data?.data}
          renderItem={({item}) => <TaskCard {...item} />}
          keyExtractor={item => item._id}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } 
        />
        {/* <TaskCard  />
        <TaskCard  /> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:10,
    flex:1
  },
  taskListContainerStyle:{
    // flexDirection:"row",
    flex:1,
    gap:10
  }
})