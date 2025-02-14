import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

export default function TaskCard() {

  const navigation = useNavigation()

  const [menuController , setMenuController] = useState()

  function taskSettings(){
    // console.log("UZUN TIKLAMA");
    menuController.open()
  }

  function taskUploadScreen(){
    navigation.navigate("TaskUpload")
  }

  return (
    <TouchableOpacity style={styles.container} onLongPress={taskSettings} onPress={taskUploadScreen} >
      <Menu style={styles.menuContainer} ref={c => setMenuController(c)}>
            <MenuTrigger  />
            <MenuOptions  >
                <TouchableOpacity style={styles.menuItemStyle} >
                  <Text style={styles.menuItemText} >Sil</Text>
                </TouchableOpacity>
          </MenuOptions>
           
        </Menu>
      <Text style={styles.titleTextStyle} >Task Title</Text>
      {/* <Text style={styles.descriptionStyle} >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, ratione. Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati commodi libero hic atque? Perferendis nos</Text> */}
      <Image style={styles.taskImageStyle} source={{uri:"https://randomuser.me/api/portraits/men/78.jpg"}} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    width:"49%",
    backgroundColor:"#BFDBFF",
    minHeight:256,
    maxHeight:320,
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:10,
    overflow:"hidden"
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