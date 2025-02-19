import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useDeleteTaskMutation } from '../store/userApi/userApiSlicer';
import Toast from 'react-native-toast-message';

export default function TaskCard({userTag,text,isImage,_id}) {

  const baseUrl = process.env.BASE_URL

  const navigation = useNavigation()

  const [deleteTask,resDeleteTask] = useDeleteTaskMutation()

  const [menuController , setMenuController] = useState()

  function taskSettings(){
    // console.log("UZUN TIKLAMA");
    menuController.open()
  }

  function taskUploadScreen(){
    navigation.navigate("TaskUpdate",{_id:_id})
  }

  async function DeleteTaskOnClick(){
    const body = {
      taskId:_id
    }
    
    await deleteTask(body).unwrap()
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Task silindi',
      });
    })
  }

  return (
    <TouchableOpacity style={styles.container} onLongPress={taskSettings} onPress={taskUploadScreen} >
      <Menu style={styles.menuContainer} ref={c => setMenuController(c)}>
            <MenuTrigger  />
            <MenuOptions  >
                <TouchableOpacity onPress={DeleteTaskOnClick} style={styles.menuItemStyle} >
                  <Text style={styles.menuItemText} >Sil</Text>
                </TouchableOpacity>
          </MenuOptions>
           
        </Menu>
      <Text style={styles.titleTextStyle} >{userTag}</Text>
      
      {
        isImage ? <Image style={styles.taskImageStyle} source={{uri:`${baseUrl}${text}`}} /> : <Text style={styles.descriptionStyle} >{text}</Text>
      }
      
      
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    width:"45%",
    backgroundColor:"#BFDBFF",
    minHeight:256,
    maxHeight:320,
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:10,
    overflow:"hidden",
    marginHorizontal:10,
    marginVertical:10
  },
  titleTextStyle:{
    fontWeight:"bold",
    fontSize:24,
    textAlign:"center"
  },
  taskImageStyle:{
    width:"100%",
    height:250,
    borderRadius:10,
    marginTop:10
  },
  descriptionStyle:{
    fontSize:16,  
  },
  menuContainer:{
    borderRadius:10,


  },
  menuItemStyle:{
    backgroundColor:"#fff",
    paddingVertical:10,
    borderRadius:10
  },
  menuItemText:{
    // borderRadius:10,
    paddingHorizontal:10
  }

})