import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TweetCard from '../components/TweetCard'

export default function HomeScreen() {
  

  return (
    <View style={styles.container}>
      
      <View style={styles.selectContainerStyle} >
        <TouchableOpacity style={styles.selectStyle} >
          <Text style={styles.selectTextStyle} >Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.selectStyle,styles.selectedStyle]} >
          <Text style={styles.selectTextStyle} >Takip Edilenler</Text>
        </TouchableOpacity>

      </View>
      
      <TweetCard/>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:32
  },
  selectContainerStyle:{
    flexDirection:"row",
    gap:10,
    marginBottom:10,
    backgroundColor:"#BFDBFF",
    
  },
  selectStyle:{
    flex:1,
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:10
  },
  selectTextStyle:{
    textAlign:"center"
  },
  selectedStyle:{
    borderBottomColor:"black",
    borderBottomWidth:3
  }
})