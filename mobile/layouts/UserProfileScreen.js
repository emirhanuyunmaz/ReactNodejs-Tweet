import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TweetCard from '../components/TweetCard'

export default function UserProfileScreen() {

  const baseUrl = process.env.BASE_URL


  return (
    <View style={styles.container} >

      <View style={styles.profileContainerStyle} >
        <Image style={styles.imageStyle} source={{uri:`${baseUrl}/uploads/12f2f34b-b523-405a-92f3-c09a47263b86.png`}} />
        
        <View>
          <Text style={styles.userNameTextStyle} >USER NAME</Text>
          <Text>...Açıklama...</Text>
          
          <TouchableOpacity style={styles.followButtonStyle} >
            <Text style={styles.followButtonTextStyle} >12 Takipçi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.followButtonStyle} >
            <Text style={styles.followButtonTextStyle} >10 Takip</Text>
          </TouchableOpacity>

        </View>

        <View>
          <TouchableOpacity style={styles.buttonStyle} >
            <Text style={styles.buttonTextStyle} >İstek At</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} >
            <Text style={styles.buttonTextStyle} >Mesaj at</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.inputContainer} >
        <TextInput style={styles.inputStyle} placeholder='Ara'  />
      </View>

      <TweetCard/>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    
  },
  profileContainerStyle:{
    backgroundColor:"#BFDBFF",
    paddingVertical:10,
    paddingHorizontal:24,
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    gap:10,
    marginBottom:10
  },
  imageStyle:{
    width:128,
    height:128,
    borderRadius:100
  },
  userNameTextStyle:{
    fontSize:16,
    fontWeight:"700"
  },
  buttonStyle:{
    backgroundColor:"#60a5fa",
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:10,
    marginBottom:10
  },
  buttonTextStyle:{
    color:"white"
  },
  inputContainer:{
    marginBottom:10,
    paddingHorizontal:12,
    borderRadius:10
  },
  inputStyle:{
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    paddingHorizontal:10
  },
  followButtonTextStyle:{
    fontWeight:"700",
  },
  followButtonStyle:{
    marginVertical:5,
  },

})