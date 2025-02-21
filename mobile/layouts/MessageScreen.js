import { FlatList, Image, KeyboardAvoidingView, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext,  useEffect,  useState } from 'react'
import {  ArrowLeft, ImageUp, SendHorizontal } from 'lucide-react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useGetUserShortProfileQuery } from '../store/userApi/userApiSlicer'
import { useGetUserAllMessageQuery } from '../store/messageApi/messageApiSlicer'
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {io} from "socket.io-client"

export default function MessageScreen() {
  const baseUrl = process.env.BASE_URL

  // const user_context = useContext(context)
  const route = useRoute()
  const navigaiton = useNavigation()
  
  const id = route.params?._id
  const getUserShortProfile = useGetUserShortProfileQuery(id)
  const getAllMessage = useGetUserAllMessageQuery(id)

  const [text,setText] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const [messageList,setMessageList] = useState([])
  const [socket,setSocket] = useState(null)

  const connectSocket = async () => {
    const token = await AsyncStorage.getItem("access_token")
    // const id = await AsyncStorage.getItem("message_user_id")
    // console.log("CONNECTED MESSAGE SOCKET CONTEXT:",id);
    
    
    s = io(baseUrl+"/", {query:{token:token,userId:id}, transports: ['websocket'], reconnection: true });;
    setSocket(s)
    
    // Alıcıya mesaj geldiğinde dinle
    s.on('receiveMessage', (newMessage) => {
        // console.log("NEW MESSAGE::",newMessage);
        setMessageList((prevMessages) => [...prevMessages, newMessage]);
      
    });
}

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    
    const newData = await getAllMessage.refetch()
    // user_context.setMessageList([])
    setMessageList(newData.data?.data)
    
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
        // console.log("data:image/png;base64,"+res.assets[0].base64)
        if(socket != null){
          try{
            const token = await AsyncStorage.getItem("access_token")

            const image ="data:image/png;base64,"+res.assets[0].base64
            // console.log(res.assets[0].uri);
            
            socket.emit('sendMessage', {text:image,token:token,getUserId:id,isImage:true})
  
            // console.log("res.assets[0].base64:::",res.assets[0]);
            console.log("BAŞLANGIÇ");
            const data = await getAllMessage.refetch()
            setMessageList(data.data?.data)
            console.log(data.data?.data)
            console.log("SON");
            
          }catch(err){
            console.log("ERRR:",err);
            
          }
        }else{
          console.log("NOT SOCKET::");
          
        }
      }
  
    }

  function GoToBackOnClick(){
    navigaiton.goBack()
  }

  function GoToUserProfileOnClick(){
    navigaiton.navigate("UserProfile",{_id:id})
  } 


  async function SendMessage(){
      
    if(socket != null){
      const token = await AsyncStorage.getItem("access_token")
        // Sunucuya mesaj gönderme olayı
      try{
        // console.log("MESAJ GİTTİ:",token);
        socket.emit('sendMessage', {text:text,token:token ,getUserId:id,isImage:false})
        setText("")
        const data = await getAllMessage.refetch()
        setMessageList(data.data.data)

      }catch(err){
        console.log("EEEE::",err);
        // Toast message:
      }
    }else{
      console.log("NOTSOCKET:::::");
    }
  }
    useFocusEffect(
      useCallback( () => {
        // user_context.connectSocket(id)
        connectSocket()
        
        onRefresh()
        
        return () => {
          if(socket != null){
            socket.disconnect()

          }
        };
      }, [])
    );

    useEffect(() => {
      if(getAllMessage.isSuccess){
          // console.log(getAllMessage.data);
          setMessageList(getAllMessage.data.data)
          
      }
    },[getAllMessage.isSuccess,getAllMessage.isFetching,getAllMessage.isError,id])


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
          data={messageList}
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
        <TouchableOpacity onPress={SendMessage} style={styles.buttonStyle} >
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