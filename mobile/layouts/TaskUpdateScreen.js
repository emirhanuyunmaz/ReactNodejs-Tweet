import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetSingleTaskQuery, useTaskImageUpdateMutation, useTaskToTweetMutation, useTaskUpdateMutation } from '../store/userApi/userApiSlicer'
import * as ImagePicker from "expo-image-picker"
import Toast from 'react-native-toast-message'


export default function TaskUpdateScreen() {
  const navigaton = useNavigation()
  const route = useRoute()
  const id = route.params?._id // Gelen veriyi yakalama işlemi.
  const baseUrl = process.env.BASE_URL

  // console.log("::IIDD::",id);
  const getSingleTask = useGetSingleTaskQuery(id)
  const [updateTask,resUpdateTask] = useTaskUpdateMutation()
  const [taskImageUpdate,resTaskImageUpdate] = useTaskImageUpdateMutation()
  const [taskToTweet,resTaskToTweet] = useTaskToTweetMutation()

  const [userTag , setUserTag ] = useState("")
  const [text,setText] = useState("")
  const [isImage,setIsImage] = useState(false)

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
        setIsImage(true)
        // console.log(res.assets[0].base64);
        
        setText("data:image/png;base64,"+res.assets[0].base64)
        await taskImageUpdate({image:"data:image/png;base64,"+res.assets[0].base64,taskId:id})
        
        Toast.show({
          type: 'success',
          text1: 'Resim Eklendi',
        });
        // console.log("res.assets[0].base64:::",res.assets[0]);
        
      }
  
    }

  async function UpdateTaskOnClick(){
    const body = {
      _id:id,
      userTag:userTag,
      text:text,
      isImage:isImage
    }
    await updateTask(body).unwrap()
    .then(() => {
      console.log("İşlem Başarılı ,,,....")
      Toast.show({
        type: 'success',
        text1: 'Başarıyla Güncellendi',
      });
      navigaton.goBack()
    })
  }


  async function TaskToTweetOnClick(){
    const body = {
      _id:id,
      userTag:userTag,
      text:text,
      isImage:isImage
    }
    await taskToTweet(body).unwrap()
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Gönderi Olarak Paylaşıldı',
      });
      navigaton.goBack()
    })
  }
  
  useEffect(() => {
    if(getSingleTask.isSuccess){
      console.log("GELEN VERİ :::");
      console.log(getSingleTask.data.data);
      setIsImage(getSingleTask.data.data.isImage)
      setUserTag(getSingleTask.data.data.userTag)
      setText(getSingleTask.data.data.text)
      
    }
  },[getSingleTask.isFetching,getSingleTask.isSuccess])

  return (
    <KeyboardAvoidingView>
      <View style={styles.container} >

        <TextInput value={userTag} onChangeText={(e) => setUserTag(e)} style={styles.tagInputStyle}  placeholder='Etiket Ekle' />

        {isImage ? <Image style={styles.imageStyle} source={{uri:`${baseUrl}${text}`}}  />
        :
        <TextInput
          value={text}
          onChangeText={(e) => setText(e)}
          placeholder='Metin Ekle'
          style={styles.textInputStyle}
          multiline={true}
          numberOfLines={10}
        />
        }
        
        {
          isImage &&
          <TouchableOpacity onPress={AddImage} style={styles.buttonStyle} >
            <Text style={styles.buttonTextStyle} >Görsel Güncelle</Text>
          </TouchableOpacity>
        }

        <TouchableOpacity onPress={TaskToTweetOnClick} style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Gönderiyi Paylaş</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={UpdateTaskOnClick} style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Kaydet</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity>
          <View style={styles.imageAddStyle} >
            <Camera size={48} color={"black"} />
          </View>
        </TouchableOpacity> */}
      
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:10
  },
  tagInputStyle:{
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    marginVertical:10,
    fontSize:20,
  },
  textInputStyle:{
    borderWidth:2,
    height:256,
    borderColor:"gray",
    textAlignVertical:"top",
    fontSize:16,
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:10
  },
  buttonStyle:{
    backgroundColor:"#BFDBFF",
    paddingVertical:10,
    marginTop:10,
    borderRadius:10
  },
  buttonTextStyle:{
    textAlign:"center",
    fontWeight:"500",
    fontSize:16

  },
  imageStyle:{
   width:"100%",
   height:256,
   resizeMode:"stretch",  
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10
  },
  imageAddStyle:{
    width:200,
    height:256,
    borderWidth:2,
    marginTop:12,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10
  },
})