import { FlatList, Image, KeyboardAvoidingView, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {  ArrowLeft, ImageUp, SendHorizontal } from 'lucide-react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useGetUserShortProfileQuery } from '../store/userApi/userApiSlicer'
import { useGetUserAllMessageQuery } from '../store/messageApi/messageApiSlicer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { messageContext } from '../context/message/messageContext'
import * as ImagePicker from "expo-image-picker"

export default function MessageScreen() {
  const baseUrl = process.env.BASE_URL

  const message_context = useContext(messageContext)
  const route = useRoute()
  const navigaiton = useNavigation()
  
  const id = route.params?._id
  const getUserShortProfile = useGetUserShortProfileQuery(id)
  const getAllMessage = useGetUserAllMessageQuery(id)

  const [text,setText] = useState("")
  const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      
      
      const newData = await getAllMessage.refetch()
      // message_context.setMessageList([])
      message_context.setMessageList(newData.data?.data)
      
      setRefreshing(false)
      
    }, []);
  
  async function AddImage(){
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
          alert('Fotoğraf galerisine erişim izni verilmedi!');
          return;
      }
  
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        // allowsEditing:true,
        // aspect:[1,1],
        quality:1,
        base64:true
      })
  
      if(res.canceled){
          console.log("CANCELL",res.assets[0]);  
      }else{
        // setText("data:image/png;base64,"+)
        await message_context.SendImageMessage(res.assets[0].base64,id)
        // console.log("res.assets[0].base64:::",res.assets[0]);
        const data =await getAllMessage.refetch()
        message_context.setMessageList([])
        message_context.setMessageList(data.data.data)
      }
  
    }

  function GoToBackOnClick(){
    navigaiton.goBack()
  }

  function GoToUserProfileOnClick(){
    navigaiton.navigate("UserProfile",{_id:id})
  } 
  
  async function SendOnClick(){
    await message_context.SendMessage(text,id)
    const data =await getAllMessage.refetch()
    // message_context.setMessageList([])
    message_context.setMessageList(data.data.data)
    setText("")
  }

    useFocusEffect(
      useCallback( () => {
        message_context.connectSocket(id)
        // Do something when the screen is focused
        onRefresh()
        
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
        };
      }, [])
    );

  // useEffect(() => {
  //   // UserIdStorageSaved()
    

    
  // },[])
  // console.log(getAllMessage.data?.data)
  
  // useEffect(() => {

  //   if(getAllMessage.isSuccess){
  //     console.log("HHH:",getAllMessage.data?.data);
      
  //     message_context.setMessageList(getAllMessage.data?.data)
  //   }

  // },[])

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
        
        <FlatList
          style={{flex:1}}
          data={message_context.messageList}
          renderItem={({item}) => <View>
                    {/* Sended Message */}
                    {item.senderUserId == id && <View style={styles.sendMessage} >
                      {
                        item.isImage ?
                        <Image style={styles.sendMessageImage} source={{uri:`${baseUrl}/${item.message}`}}/>
                        :
                        <Text style={styles.sendMessageText} >{item.message}</Text>
                      }
                      <Text style={styles.sendMessageDateText} >12:32</Text>
                    </View>}
                  {/* Incoming Message */}
                  { item.recipientUserId == id && <View style={styles.incomingMessage} >
                    {item.isImage ?<Image style={styles.incomingMessageImage}  source={{uri:`${baseUrl}/${item.message}`}} /> : <Text style={styles.incomingMessageText} >{item.message}</Text>}
                    
                    <Text style={styles.incomingMessageDateText} >12:10</Text>
                  </View>}
          </View>}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } 
        />

      </View>
      
      <View style={styles.inputGroupStyle} >
        <TextInput value={text} onChangeText={(e) => setText(e)} style={styles.inputStyle} placeholder='Mesaj' />
        <TouchableOpacity onPress={SendOnClick} style={styles.buttonStyle} >
          <SendHorizontal color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={AddImage} style={styles.buttonStyle} >
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
    flex:1,
    paddingBottom:52
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
    borderBottomRightRadius:10,
    marginVertical:5
  },
  sendMessageText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:16
  },
  sendMessageImage:{
    width:120,
    height:120,
    paddingHorizontal:10,
    resizeMode:"stretch"
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
    borderBottomLeftRadius:10,
    marginVertical:5
  },
  incomingMessageText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:16
  },
  incomingMessageImage:{
    width:120,
    height:120,
    paddingHorizontal:10,
    resizeMode:"stretch"
  },
  incomingMessageDateText:{
    color:"white",
    paddingHorizontal:10,
    fontSize:10
  }
})