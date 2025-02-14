import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function NotificationCard() {
  const baseUrl = process.env.BASE_URL

  return (
    <View style={styles.container} >
      <Image style={styles.imageStyle} source={{uri:`${baseUrl}/uploads/12f2f34b-b523-405a-92f3-c09a47263b86.png`}} />
      <View>
        <Text style={styles.userNameStyle} >USER NAME</Text>
        <Text style={styles.textStyle}  >NotificationCard</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#BFDBFF",
    flexDirection:"row",
    borderRadius:10,
    marginTop:10,
    paddingHorizontal:10,
    marginHorizontal:10,
    paddingVertical:5,
    alignItems:"center",
    gap:5
  },
  imageStyle:{
    width:60,
    height:60,
    borderRadius:100,
  },
  userNameStyle:{
    fontWeight:"bold"
  },
  textStyle:{
    fontSize:16
  }
})