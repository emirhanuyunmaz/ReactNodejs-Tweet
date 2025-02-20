import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useGetSingleTweetQuery, useUserTweetAddCommentMutation } from '../store/userApi/userApiSlicer'
import { context } from '../context/context'

export default function CommentScreen() {
  const user_context = useContext(context)
  const navigation = useNavigation()
  const route = useRoute()
  const id = route.params?._id
  
  console.log("ADSA:",id);
  
  const [text , setText] = useState("")
  
  const getSingleTweet = useGetSingleTweetQuery(id)
  const [addCommetTweet,resAddCommentTweet] = useUserTweetAddCommentMutation()



  async function AddComment(){
    try{
      // console.log("GİRİŞ");
      
      await addCommetTweet({tweetId:id,text:text})
      user_context.tweetCommentSocket(getSingleTweet.data?.data,"tweetComment")
      navigation.goBack()
      // console.log("Çıkış");
      
    }catch(err){
      console.log("HATA VARRR:",err);
      
    }
  }
  
  return (
    <View>
      <Text style={styles.titleStyle} >Yeni Yorum</Text>
        <View style={styles.inputContainer} >
                  <TextInput
                    value={text}
                    onChangeText={(e) => setText(e)}
                    placeholder='Yorum Yaz'
                    style={styles.inputStyle}
                    multiline={true}
                    numberOfLines={10}
                  />
                  <TouchableOpacity onPress={AddComment} style={styles.buttonStyle} >
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