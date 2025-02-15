import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function CommentScreen() {
  return (
    <View>
      <Text style={styles.titleStyle} >Yeni Yorum</Text>
        <View style={styles.inputContainer} >
                  <TextInput
                    placeholder='Yorum Yaz'
                    style={styles.inputStyle}
                    multiline={true}
                    numberOfLines={10}
                  />
                  <TouchableOpacity style={styles.buttonStyle} >
                    <Text style={styles.buttonTextStyle} >Paylaş</Text>
                  </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    titleStyle:{
        fontSize:24,
        fontWeight:"500",
        textAlign:"center"
    },
    inputContainer:{

    },
    inputStyle:{
        borderWidth:2,
        borderColor:"gray",
        marginHorizontal:10,
        borderRadius:10,
        paddingHorizontal:10,
        textAlignVertical:"top",
        height:120,
        marginTop:10
      },
      buttonStyle:{
        backgroundColor:"#BFDBFF",
        paddingVertical:10,
        marginHorizontal:10,
        borderRadius:10,
        marginTop:10
      },
      buttonTextStyle:{
        textAlign:"center"
      }
})