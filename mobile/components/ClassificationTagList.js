import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function ClassificationTagList({tagList}) {
  tagList = tagList == undefined ? [] : tagList
  console.log("TAG LİST:::",tagList);
  const totalCount = tagList.reduce((sum, item) => sum + item.count, 0) ;
  console.log(totalCount);
  
  
  return (
    <View style={styles.container} >
      <Text style={styles.titleStyle} >Duygular</Text>
      
      <ScrollView style={styles.tagScrollStyle} >
      <View style={styles.tagContainer} >
        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Kızgın </Text>
            <Text>%{Math.floor(tagList.filter((item) => item._id == "kızgın").length != 0 ? tagList.filter((item) => item._id == "kızgın")[0].count/totalCount * 100 : 0)}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Korku </Text>
            <Text>%{Math.floor(tagList.filter((item) => item._id == "korku").length  != 0 ? tagList.filter((item) => item._id == "korku")[0].count/totalCount * 100 : 0)}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Mutlu</Text>
            <Text>%{Math.floor(tagList.filter((item) => item._id == "mutlu").length != 0 ? tagList.filter((item) => item._id == "mutlu")[0].count/totalCount * 100 : 0 )}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Sürpriz </Text>
            <Text>%{Math.floor(tagList.filter((item) => item._id == "surpriz").length != 0 ? tagList.filter((item) => item._id == "surpriz")[0].count/totalCount * 100 : 0) }</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Üzgün </Text>
            <Text>%{Math.floor(tagList.filter((item) => item._id == "üzgün").length != 0 ? tagList.filter((item) => item._id == "üzgün")[0].count/totalCount * 100 : 0)}</Text>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
      
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
    flexDirection:"row",
    paddingHorizontal:10,
    // paddingVertical:10,
    marginTop:10,
    gap:10
  },
  tagScrollStyle:{
    flexDirection:"row"
  },
  tagItemContainer:{
    borderBottomWidth:3,
    borderColor:"white",
    marginVertical:5,
    paddingVertical:5,
    paddingHorizontal:10,
    justifyContent:"center",
    alignItems:"center"
  },
  tagTextStyle:{
    fontSize:20,
    fontWeight:"500"
  },
})