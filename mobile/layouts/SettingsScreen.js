import { Image, KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../store/userApi/userApiSlicer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SettingsScreen() {
  
  const baseUrl = process.env.BASE_URL
  const getUserProfile = useGetUserProfileQuery()
  const [updateProfile,responseUpdateProfile] = useUpdateUserProfileMutation()

  const [userName,setUserName] = useState("")
  const [userSurname,setUserSurname] = useState("")
  const [userEmail,setUserEmail] = useState("")
  const [userPassword,setUserPassword] = useState("")
  const [userDescription,setUserDescription] = useState("")
  const [profilePrivate,setProfilePrivate] = useState(false)
  const [profileImage,setProfileImage] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const [passwordControl,setPasswordControl] = useState(true)

    const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
  
    await getUserProfile.refetch()
    
    setRefreshing(false)
    }, []);

  function UpdateImageOnClick(){

  }

  async function UpdateProfileOnClick(){
    const body={
      name:userName,
      surname:userSurname,
      email:userEmail,
      password:userPassword,
      description:userDescription,
      profilePrivate:profilePrivate
    }
    await updateProfile(body).unwrap()
    .then(() => {
      console.log("İŞLEM BAŞARILI");
    })
    await getUserProfile.refetch()
  }

  useEffect(() => {
    if(getUserProfile.isSuccess){
      setUserName(getUserProfile.data.name)
      setUserSurname(getUserProfile.data.surname)
      setUserEmail(getUserProfile.data.email)
      setUserPassword(getUserProfile.data.password)
      setUserDescription(getUserProfile.data.description)
      setProfilePrivate(getUserProfile.data.profilePrivate)
      console.log(getUserProfile.data.profilePrivate);
      
      setProfileImage(getUserProfile.data.image)
    }
  },[getUserProfile.isSuccess,getUserProfile.isFetching])

  return (
  <SafeAreaProvider style={{flex:1}} >
    <SafeAreaView style={{flex:1}} >
    <KeyboardAvoidingView style={styles.container} >
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  >
      
      <TouchableOpacity onPress={UpdateImageOnClick} style={styles.imageButtonStyle} >
        <View style={styles.imageContainerStyle} >
          <Image  style={styles.imageStyle} source={{uri:`${baseUrl}/${profileImage}`}} />
        </View>
        
      </TouchableOpacity>
      <View style={{marginBottom:10}} >
        {/* Select İşlemi */}
        <Text style={styles.selectLabelStyle} >Profile Durumu</Text>
        <View style={styles.selectContainer} >
          <Picker
            style={styles.selectStyle}
            selectedValue={`${profilePrivate}`}
            onValueChange={(itemValue, itemIndex) =>
              setProfilePrivate(itemValue)
            }>
            <Picker.Item label="Profil Gizli" value="true" />
            <Picker.Item label="Profil Açık" value="false" />
          </Picker>
          
        </View>
      </View>

      <View style={styles.inputContainerStyle} >

        <View style={styles.nameSurnameContainerStyle} >        
          <View style={styles.inputNameContainerStyle} >
            <Text style={styles.labelStyle} >Ad</Text>
            <TextInput value={userName} onChangeText={(e) => setUserName(e)} style={styles.inputStyle} placeholder='Ad' />
          </View>
          <View style={styles.inputNameContainerStyle} >
            <Text style={styles.labelStyle} >Soyad</Text>
            <TextInput value={userSurname} onChangeText={(e) => setUserSurname(e)} style={styles.inputStyle} placeholder='Soyad' />
          </View>
        </View>

        <View style={styles.inputItemContainerStyle} >
            <Text style={styles.labelStyle} >Email</Text>
            <TextInput editable={false} value={userEmail} onChangeText={(e) => setUserEmail(e)} style={styles.emailInputStyle} placeholder='Email' />
        </View>

        <View style={styles.inputItemContainerStyle} >
            <Text style={styles.labelStyle} >Password</Text>
            <View  style={[styles.inputStyle,{flexDirection:"row",alignItems:"center"}]} >
              <TextInput secureTextEntry={passwordControl} style={{flex:1}} value={userPassword} onChangeText={(e) => setUserPassword(e)} placeholder='Password' />
              <TouchableOpacity onPress={() => setPasswordControl(!passwordControl)} >
                <Text>
                  {passwordControl ? <Eye color={`black`} size={24} /> : <EyeOff color={`black`} size={24}/>} 
                </Text>
              </TouchableOpacity>
            </View>
        </View>
        
        <View style={styles.inputItemContainerStyle} >
            <Text style={styles.labelStyle} >Açıklama</Text>
            <TextInput value={userDescription} onChangeText={(e) => setUserDescription(e)} style={styles.inputDescriptionStyle} placeholder='Açıklama' multiline={true} numberOfLines={10} />
        </View>

      </View>

      <TouchableOpacity onPress={UpdateProfileOnClick} style={styles.buttonStyle} >
        <Text style={styles.buttonTextStyle} >Güncelle</Text>
      </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  imageContainerStyle:{
    
  },
  imageButtonStyle:{
    borderWidth:2,
    borderColor:"gray",
    width:200,
    height:200,
    borderRadius:100,
    marginHorizontal:"auto",
    marginTop:24
  },
  imageStyle:{
    width:"100%",
    height:"100%",
    borderRadius:100
  },
  labelStyle:{
    fontWeight:"500",
    fontSize:16,
    marginStart:8,
    marginBottom:3,
  },
  selectLabelStyle:{
    marginStart:20,
    fontWeight:"500",
    fontSize:16,
  },
  inputContainerStyle:{
    marginHorizontal:10,
    gap:10
  },
  nameSurnameContainerStyle:{
    flexDirection:"row",
    gap:10
  },
  inputNameContainerStyle:{
    flex:1,
  },
  inputItemContainerStyle:{
    // flex:1,
    // marginHorizontal:5
  },
  inputStyle:{
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    paddingHorizontal:10
  },
  emailInputStyle:{
    borderWidth:2,
    borderColor:"gray",
    backgroundColor:"gray",
    borderRadius:10,
    paddingHorizontal:10
  },
  inputDescriptionStyle:{
    height:120,
    paddingHorizontal:10,
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    textAlignVertical:"top",
  },
  buttonStyle:{
    backgroundColor:"#BFDBFF",
    paddingVertical:12,
    marginHorizontal:10,
    borderRadius:10,
    marginTop:10

  },
  buttonTextStyle:{
    fontWeight:"500",
    fontSize:16,
    textAlign:"center"
  },
  selectContainer:{
    marginTop:10,
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    marginHorizontal:10

  },
  selectStyle:{
  }
})