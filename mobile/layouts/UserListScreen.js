import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserProfileCard from '../components/UserProfileCard'

export default function UserListScreen() {

  return (
    <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle} >Mesaj</Text>
        </View>

        <View style={styles.userContainer} >
          <UserProfileCard/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:24,
    // marginHorizontal:10
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
    marginHorizontal:10
  }
})