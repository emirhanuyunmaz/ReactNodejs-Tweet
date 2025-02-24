import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useAddTaskMutation, useAddTweetMutation } from '../store/userApi/userApiSlicer'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker"
import Toast from 'react-native-toast-message'

export default function AddTweetScreen() {

  const navigation = useNavigation()

  const [userTag,setUserTag] = useState("")
  const [text,setText] = useState("")
  const [isImage,setIsImage] = useState(false)

  const [addTweet,resAddTweet] = useAddTweetMutation()
  const [addTask,resAddTask] = useAddTaskMutation()
  
  async function UserAddTask(){
    await addTask({userTag:userTag,text:text,isImage:isImage}).unwrap()
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Taslak Olarak Kaydedildi',
      });
      navigation.goBack()
    })
  }

  async function UserAddTweet(){  
    await addTweet({userTag:userTag,text:text,isImage:isImage}).unwrap()
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Gönderi Başarıyla Paylaşıldı',
      });
      navigation.goBack()
    })
  }

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
      setText("data:image/png;base64,"+res.assets[0].base64)
      // console.log("res.assets[0].base64:::",res.assets[0]);
    }
  }

  return (
    <KeyboardAvoidingView>
      <View style={styles.container} >

        <TextInput value={userTag} onChangeText={(e) => setUserTag(e)}  style={styles.tagInputStyle}  placeholder='Etiket Ekle' />

        {isImage ?<Image style={styles.imageAddStyle} source={{uri:`${text}`}} /> :<TextInput
          value={text}
          onChangeText={(e) => setText(e)}
          placeholder='Metin Ekle'
          style={styles.textInputStyle}
          multiline={true}
          numberOfLines={10}
        />}

        <TouchableOpacity onPress={AddImage} style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Görsel Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={UserAddTweet}  style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Gönderi Paylaş</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={UserAddTask} style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Taslak Olarak Kaydet</Text>
        </TouchableOpacity>
      
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
  imageAddStyle:{
    width:"100%",
    height:256,
    borderWidth:2,
    marginTop:12,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,
    resizeMode:"stretch"
  },
})