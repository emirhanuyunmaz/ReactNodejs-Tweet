import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function ClassificationTagList() {
  return (
    <View style={styles.container} >
      <Text style={styles.titleStyle} >Duygular</Text>
      
      <ScrollView style={styles.tagScrollStyle} >
      <View style={styles.tagContainer} >
        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Kızgın </Text>
            <Text>21</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Korku </Text>
            <Text>23</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Mutlu </Text>
            <Text>52</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Sürpriz </Text>
            <Text>8</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.tagItemContainer} >
            <Text style={styles.tagTextStyle} >Üzgün </Text>
            <Text>4</Text>
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