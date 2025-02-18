import { Image, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ClipboardList, LogOut, Settings } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetUserProfileQuery, useGetUserShortProfileQuery } from '../store/userApi/userApiSlicer'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  

  const baseUrl = process.env.BASE_URL
  const getUserProfile = useGetUserProfileQuery()
  // const getUserShortProfile = useGetUserShortProfileQuery()
  const navigation = useNavigation()

  const [userData,setUserData] = useState(null)
  const [refreshing, setRefreshing] = useState(false);

  function userProfileScreen(){
    navigation.navigate("UserProfile",{_id:userData._id})
  }

  function userSettingsScreen(){
    navigation.navigate("Settings")
  }
  
  function userTasksScreen(){
    navigation.navigate("Tasks")
  }

  const onRefresh = React.useCallback(async () => {
  setRefreshing(true);

  await getUserProfile.refetch()
  
  setRefreshing(false)
  }, []);

  useEffect(() => {

    if(getUserProfile.isSuccess){
      console.log("::AAADDDD:");
      setUserData(getUserProfile.data)
      console.log(getUserProfile.data);
    }

  },[getUserProfile.isFetching,getUserProfile.isSuccess])

  return (
    <SafeAreaProvider style={{flex:1}} >
      <SafeAreaView style={{flex:1}} >
      <ScrollView contentContainerStyle={styles.scrollView}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
    <View style={styles.container}>
      <TouchableOpacity onPress={userProfileScreen} style={styles.profileContainerStyle}>
        <Image source={{uri:`${baseUrl}/${userData?.image}`}} style={styles.profileImageStyle} />
        <View>
          <Text style={styles.profileTextStyle} >{userData?.name} {userData?.surname}</Text>
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
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
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