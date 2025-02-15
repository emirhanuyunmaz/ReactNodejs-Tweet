import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import {Picker} from '@react-native-picker/picker';

export default function SettingsScreen() {
  const baseUrl = process.env.BASE_URL
  const [selectedLanguage, setSelectedLanguage] = useState();

  function updateImage(){

  }

  return (
    <KeyboardAvoidingView style={styles.container} >
    <ScrollView style={styles.container} >
      
      <TouchableOpacity onPress={updateImage} style={styles.imageButtonStyle} >
        <View style={styles.imageContainerStyle} >
          <Image  style={styles.imageStyle} source={{uri:`${baseUrl}/uploads/12f2f34b-b523-405a-92f3-c09a47263b86.png`}} />
        </View>
        
      </TouchableOpacity>
      <View style={{marginBottom:10}} >
        <Text style={styles.selectLabelStyle} >Profile Durumu</Text>
        <View style={styles.selectContainer} >
          <Picker
            style={styles.selectStyle}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            <Picker.Item label="Profil Gizli" value="Profil Gizli" />
            <Picker.Item label="Profil Açık" value="Profil Açık" />
          </Picker>
          
        </View>
      </View>

      <View style={styles.inputContainerStyle} >

        <View style={styles.nameSurnameContainerStyle} >        
          <View style={styles.inputNameContainerStyle} >
            <Text style={styles.labelStyle} >Ad</Text>
            <TextInput style={styles.inputStyle} placeholder='Ad' />
          </View>
          <View style={styles.inputNameContainerStyle} >
            <Text style={styles.labelStyle} >Soyad</Text>
            <TextInput style={styles.inputStyle} placeholder='Soyad' />
          </View>
        </View>

        <View style={styles.inputItemContainerStyle} >
            <Text style={styles.labelStyle} >Email</Text>
            <TextInput  style={styles.inputStyle} placeholder='Email' />
        </View>

        <View style={styles.inputItemContainerStyle} >
            <Text style={styles.labelStyle} >Password</Text>
            <TextInput style={styles.inputStyle} placeholder='Password' />
        </View>
        
        <View style={styles.inputItemContainerStyle} >
            <Text style={styles.labelStyle} >Açıklama</Text>
            <TextInput style={styles.inputDescriptionStyle} placeholder='Açıklama' multiline={true} numberOfLines={10} />
        </View>

      </View>

      <TouchableOpacity style={styles.buttonStyle} >
        <Text style={styles.buttonTextStyle} >Güncelle</Text>
      </TouchableOpacity>

    </ScrollView>
    </KeyboardAvoidingView>
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