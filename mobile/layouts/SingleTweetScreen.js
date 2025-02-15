import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TweetCard from '../components/TweetCard'
import ClassificationTagList from '../components/ClassificationTagList'
import CommentCard from '../components/CommentCard'
import { useNavigation } from '@react-navigation/native'

export default function SingleTweetScreen() {

  const navigation = useNavigation()

  function commentScreen(){
    navigation.navigate("Comment")
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.container} >
          <View>
            <ClassificationTagList/>
          </View>
          
          <TweetCard/>

          <TouchableOpacity style={styles.buttonStyle} onPress={commentScreen} >
            <Text style={styles.buttonTextStyle} >
              Yorum Ekle
            </Text>
          </TouchableOpacity>

          <View>
            <CommentCard/>
            <CommentCard/>
            <CommentCard/>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:10
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