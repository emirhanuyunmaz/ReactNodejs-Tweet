import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NotificationCard from '../components/NotificationCard'

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer} >
        <Text style={styles.titleStyle} >Bildirimler</Text>
      </View>
      <NotificationCard /> 
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:24 

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