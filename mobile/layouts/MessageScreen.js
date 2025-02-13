import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {  ImageUp, SendHorizontal } from 'lucide-react-native'

export default function MessageScreen() {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.messageContainerStyle}>
        <Text>Mesaj List</Text>
      </View>
      
      <View style={styles.inputGroupStyle} >
        <TextInput style={styles.inputStyle} placeholder='Mesaj' />
        <TouchableOpacity style={styles.buttonStyle} >
          <SendHorizontal color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} >
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
    justifyContent:"space-between",
    paddingBottom:20
  },
  messageContainerStyle:{
    marginHorizontal:10,
    marginVertical:10,

  },
  inputGroupStyle:{
    marginHorizontal:16,
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
  }
})