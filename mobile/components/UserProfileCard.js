import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function UserProfileCard() {
      const navigation = useNavigation()
      
      function messageScreen(){
            navigation.navigate("Message")
      }
  return (
    <TouchableOpacity onPress={messageScreen} style={styles.container}>
        <Image style={styles.profileImageStyle} source={{uri:"https://randomuser.me/api/portraits/men/78.jpg"}} />
        <Text style={styles.userNameStyle}>USER NAME</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#BFDBFF",
        flexDirection:"row",
        alignItems:"center",
        gap:8,
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10
    },
    profileImageStyle:{
        width:64,
        height:64,
        borderRadius:100
    },
    userNameStyle:{
        fontSize:20,
        fontWeight:"500",
        
    }
})