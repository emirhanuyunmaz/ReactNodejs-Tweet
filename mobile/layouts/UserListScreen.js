import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserProfileCard from '../components/UserProfileCard'

export default function UserListScreen() {



  return (
    <View style={styles.container}>
        <Text>User List</Text>
        <UserProfileCard/>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:52,
    marginHorizontal:10
  }
})