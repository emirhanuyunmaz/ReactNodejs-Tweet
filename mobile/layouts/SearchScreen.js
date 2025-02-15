import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import ClassificationTagList from '../components/ClassificationTagList'
import TagList from '../components/TagList'

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInputStyle} placeholder='Ara' />
      
      <ScrollView style={styles.tagContainerStyle} >

      <View style={styles.classificationContainerStyle} >
        <ClassificationTagList/>
      </View>

      <View>
        <TagList  />
      </View>

      </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:52,
    marginBottom:52
  },

  searchInputStyle:{
    backgroundColor:"white",
    marginHorizontal:16,
    paddingHorizontal:12,
    borderRadius:10,
    borderColor:"gray",
    borderWidth:2
  },
  tagContainerStyle:{
    marginTop:10,
    
  },
  classificationContainerStyle:{
    marginBottom:10
  }
})