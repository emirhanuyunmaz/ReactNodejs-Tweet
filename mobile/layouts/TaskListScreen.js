import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TaskCard from '../components/TaskCard'

export default function TaskListScreen() {
  return (
    <View style={styles.container} >
      <Text>TaskListScreen</Text>
      <View style={styles.taskListContainerStyle}>
        <TaskCard  />
        <TaskCard  />

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:10
  },
  taskListContainerStyle:{
    flexDirection:"row",
    gap:10
  }
})