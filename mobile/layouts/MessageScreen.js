import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {  ArrowLeft, ImageUp, SendHorizontal } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetUserShortProfileQuery } from '../store/userApi/userApiSlicer'

export default function MessageScreen() {
  const baseUrl = process.env.BASE_URL

  const route = useRoute()
  const id = route.params?._id
  const navigaiton = useNavigation()
  const getUserShortProfile = useGetUserShortProfileQuery(id)

  // console.log(getUserShortProfile.data);
  
  function GoToBackOnClick(){
    navigaiton.goBack()
  }

  function GoToUserProfileOnClick(){
    navigaiton.navigate("UserProfile",{_id:id})
  } 
  
  function SendOnClick(){
   
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      
      {/* User Profile */}
      <View style={styles.userProfileStyle} >
        <TouchableOpacity onPress={GoToBackOnClick} >
          <Text><ArrowLeft size={24} color={"white"} /></Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={GoToUserProfileOnClick} style={{flexDirection:"row",alignItems:"center"}} >
          <Image style={styles.userProfileImageStyle} source={{uri:`${baseUrl}/${getUserShortProfile.data?.data?.image}`}}  />
          <Text style={{color:"white" , fontSize:24,marginStart:10}} >{getUserShortProfile.data?.data?.name} {getUserShortProfile.data?.data?.surname}</Text>
        </TouchableOpacity>

      </View>


      <View style={styles.messageContainerStyle}>
        
        {/* Sended Message */}
        <View style={styles.sendMessage} >
          <Text style={styles.sendMessageText} >Merhaba</Text>
          <Text style={styles.sendMessageDateText} >12:32</Text>
        </View>
        {/* Incoming Message */}

        <View style={styles.incomingMessage} >
          <Text style={styles.incomingMessageText} >Merhaba</Text>
          <Text style={styles.incomingMessageDateText} >12:10</Text>
        </View>

      </View>
      
      <View style={styles.inputGroupStyle} >
        <TextInput style={styles.inputStyle} placeholder='Mesaj' />
        <TouchableOpacity onPress={SendOnClick} style={styles.buttonStyle} >
          <SendHorizontal color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} >
          <ImageUp color={"white"} />
        </TouchableOpacity>
      </View>
      
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#BFDBFF",
    // justifyContent:"space-between",
    paddingBottom:20,
    paddingTop:20
  },
  userProfileStyle:{
    backgroundColor:"dodgerblue",
    flexDirection:"row",
    alignItems:"center",  
    paddingVertical:12,
    paddingHorizontal:16,
    gap:12
  },
  userProfileImageStyle:{
    width:64,
    height:64,
    borderRadius:100
  },
  messageContainerStyle:{
    marginHorizontal:10,
    marginVertical:10,

  },
  inputGroupStyle:{
    position:"absolute",
    bottom:20,
    paddingHorizontal:16,
    marginEnd:20,
    flexDirection:"row",
    gap:8
  },
  inputStyle:{
    backgroundColor:"white",
    borderRadius:10,
    paddingHorizontal:10,
    width:"74%"
  },
  buttonStyle:{
    backgroundColor:"dodgerblue",
    paddingHorizontal:10,
    justifyContent:"center",
    borderRadius:10
  },

  // Message
  sendMessage:{
    backgroundColor:"dodgerblue",
    paddingVertical:10,
    marginEnd:"auto",
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    borderBottomRightRadius:10

  },
  sendMessageText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:16
  },
  sendMessageDateText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:10,
    marginStart:"auto"
  },

  incomingMessage:{
    backgroundColor:"dodgerblue",
    paddingVertical:10,
    marginStart:"auto",
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },
  incomingMessageText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:16
  },
  incomingMessageDateText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:10
  }
})