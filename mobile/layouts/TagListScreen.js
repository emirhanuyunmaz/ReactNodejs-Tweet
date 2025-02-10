import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

export default function TagListScreen() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInputStyle} placeholder='Ara' />
      <View>
        <Text>Etiketler</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:52,

  },

  searchInputStyle:{
    backgroundColor:"white",
    marginHorizontal:16,
    paddingHorizontal:12,
    borderRadius:10
  }
})