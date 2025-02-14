import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ClipboardList, LogOut, Settings } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

export default function ProfileScreen() {
  const baseUrl = process.env.BASE_URL
  
  const navigation = useNavigation()

  function userProfileScreen(){
    navigation.navigate("UserProfile")
  }

  function userSettingsScreen(){
    navigation.navigate("Settings")
  }
  
  function userTasksScreen(){
    navigation.navigate("Tasks")
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={userProfileScreen} style={styles.profileContainerStyle}>
        <Image source={{uri:`${baseUrl}/uploads/12f2f34b-b523-405a-92f3-c09a47263b86.png`}} style={styles.profileImageStyle} />
        <View>
          <Text style={styles.profileTextStyle} >ProfileScreen</Text>
          <Text>Profile Git</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonContainerStyle}>

          <TouchableOpacity onPress={userSettingsScreen} style={styles.buttonStyle} >
            <Settings size={26} color={"black"}  />
            <Text style={styles.buttonTextStyle} >Ayarlar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={userTasksScreen} style={styles.buttonStyle} >
            <ClipboardList size={26} color={"black"}  />
            <Text style={styles.buttonTextStyle} >Taslaklar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonStyle} >
            <LogOut size={26} color={"black"}  />
            <Text style={styles.buttonTextStyle} >Çıkış Yap</Text>
          </TouchableOpacity>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:52,
    marginHorizontal:10,

  },
  profileContainerStyle:{
    flexDirection:"row",
    alignItems:"center",
    gap:16,
    backgroundColor:"#BFDBFF",
    paddingVertical:10,
    paddingHorizontal:10,
    borderRadius:10,
  },
  profileTextStyle:{
    fontSize:24,
    fontWeight:"600"
  },
  profileImageStyle:{
    width:96,
    height:96,
    borderRadius:100,
  },
  buttonContainerStyle:{
    marginTop:10,
    gap:10
  },
  buttonStyle:{
    backgroundColor:"#BFDBFF",
    paddingHorizontal:16,
    paddingVertical:16,
    borderRadius:10,
    flexDirection:"row",
    gap:8
  },
  buttonTextStyle:{
    fontSize:20,
    fontWeight:"500"
  }

})