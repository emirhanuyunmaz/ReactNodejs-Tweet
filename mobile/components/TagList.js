import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function TagList({userTagList}) {
  const navigation = useNavigation() 
  function tagListScreen(tag){
    navigation.navigate("TagTweetList",{tag:tag})
  }

  return (
    <View style={styles.container} >
      <Text style={styles.titleStyle} >Etiketler</Text>
      
      <View style={styles.tagContainer} >
        {userTagList?.length > 0 && userTagList.map((item) => <TouchableOpacity key={item._id} onPress={() => tagListScreen(item._id)} >
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >#{item?._id} </Text>
            <Text>{item?.count}</Text>
          </View>
        </TouchableOpacity>)}
        
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:10,
    paddingVertical:10,
    backgroundColor:"#BFDBFF",
    borderRadius:10
  },
  titleStyle:{
    fontSize:20,
    fontWeight:"700",
    paddingHorizontal:10
  },
  tagContainer:{
    paddingHorizontal:10,
    paddingVertical:10,
    // marginTop:10,
  },
  tagItemContainer:{
    borderBottomWidth:3,
    borderColor:"white",
    marginVertical:5,
    paddingVertical:5,
    paddingHorizontal:10
  },
  tagTextStyle:{
    fontSize:20,
    fontWeight:"700",
  },
})