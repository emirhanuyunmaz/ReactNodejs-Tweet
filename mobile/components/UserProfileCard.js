import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function UserProfileCard({_id,image,name,surname}) {
    const baseUrl = process.env.BASE_URL

      const navigation = useNavigation()
      
      function messageScreen(){
            navigation.navigate("UserProfile",{_id:_id})
      }
  return (
    <TouchableOpacity onPress={messageScreen} style={styles.container}>
        <Image style={styles.profileImageStyle} source={{uri:`${baseUrl}/${image}`}} />
        <Text style={styles.userNameStyle}>{name} {surname}</Text>
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