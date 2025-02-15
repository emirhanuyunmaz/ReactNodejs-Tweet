import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'


export default function TaskUpdateScreen() {
  return (
    <KeyboardAvoidingView>
      <View style={styles.container} >

        <TextInput style={styles.tagInputStyle}  placeholder='Etiket Ekle' />

        <TextInput
          placeholder='Metin Ekle'
          style={styles.textInputStyle}
          multiline={true}
          numberOfLines={10}
        />

        <TouchableOpacity style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Görsel Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} >
          <Text style={styles.buttonTextStyle} >Gönderi Paylaş</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} >
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