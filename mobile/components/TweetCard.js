import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { useTweetLikeMutation, useUserTweetDislikeMutation } from '../store/userApi/userApiSlicer';
import { context } from '../context/context';

export default function TweetCard({_id,text,comments,createdAt,userTag,tag,likes,userId,isImage,userIsFollow}) {
  // console.log(userIsFollow);
  
  const baseUrl = process.env.BASE_URL
  const navigation = useNavigation()
  const user_context = useContext(context)


  const [tweetDislike,responseTweetDislike] = useUserTweetDislikeMutation()
  const [userLikeTweet,responseLikeTweet] = useTweetLikeMutation()
  const [isFollow,setIsFollow] = useState(userIsFollow)
  const [likesLength,setLikesLength] = useState(likes.length)

  // Yorum sayfasına gönderme işlemi.
  function tweetCommentPage(){
    navigation.navigate("SingleTweet",{_id:_id})
  }

  // Kullanıcı profiline gönderme işlemi.
  function UserProfileOnClick(){
    navigation.navigate("UserProfile",{_id:userId._id})
  }

  // Tweet Beğenme işlemi
  async function likeTweet(){
    userIsFollow = true
    setIsFollow(true)
    setLikesLength(likesLength+1)
    await userLikeTweet({tweetId:_id})
    const tweet = {_id,text,comments,createdAt,userTag,tag,likes,userId,isImage,userIsFollow}
    user_context.tweetLikeSocket(tweet,"like")
  }

  // Tweet beğeni çekme işlemi
  async function dislikeTweet(){
    userIsFollow = false 
    setIsFollow(false)
    setLikesLength(likesLength-1)
    await tweetDislike({tweetId:_id})
    const tweet = {_id,text,comments,createdAt,userTag,tag,likes,userId,isImage,userIsFollow}
    user_context.tweetLikeSocket(tweet,"unlike")
  }
  useEffect(() => {

  },[userIsFollow])

  return (
    <View style={styles.container}>
      <View style={styles.userAndTag}>
        
        <TouchableOpacity onPress={UserProfileOnClick} style={styles.userContainerStyle}>
          <Image style={styles.userProfileImageStyle} source={{uri:`${baseUrl}/${userId.image}`}}/>
          <View>
            <Text style={styles.userNameStyle} >{userId.name} {userId.surname}</Text>
            <Text  >12/12/2025</Text>
            <Text style={styles.tagStyle} >#{userTag}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.tagStyle}>{tag.toUpperCase()}</Text>
      </View>

      {isImage ? <Image style={styles.postImageContainer} source={{uri:`${baseUrl}${text}`}}/>:
      <Text style={styles.postContainer}>
          {text}
      </Text>}
      
      <View style={styles.buttonStyle}>
        

        {isFollow ? <TouchableOpacity onPress={dislikeTweet} >
            <View style={styles.iconStyle}>
              <Heart size={28} fill={"red"} color={"red"} />
              <Text style={styles.iconTextStyle}>{likesLength}</Text>
            </View>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={likeTweet} >
          <View style={styles.iconStyle}>
            <Heart size={28} color={"black"} />
            <Text style={styles.iconTextStyle}>{likesLength}</Text>
          </View>
        </TouchableOpacity>
        }
        
        <TouchableOpacity onPress={tweetCommentPage}>
            <View style={styles.iconStyle}>
              <MessageCircle size={28} color={"black"} />
              <Text style={styles.iconTextStyle}>{comments.length}</Text>
            </View>
        </TouchableOpacity>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    padding:10,
    marginHorizontal:12,
    backgroundColor:"#BFDBFF",
    borderRadius:10,
    marginTop:10,
    marginBottom:5
  },
  userAndTag:{
    flexDirection:"row",
    justifyContent:"space-between"
  },
  tagStyle:{
    fontWeight:"700",
    fontSize:16,
    marginTop:5,
    paddingRight:15
  },
  userContainerStyle:{
    flexDirection:"row",
    alignItems:"center",
    gap:12,
    marginBottom:10
  },
  userProfileImageStyle:{
    width:50,
    height:50,
    borderRadius:100
  },
  userNameStyle:{
    fontWeight:"700",
    fontSize:16
  },
  postContainer:{
    marginHorizontal:20
  },
  postImageContainer:{
    width:280,
    height:320,
    marginHorizontal:"auto",
    borderRadius:10,
    resizeMode:"stretch"
  },
  buttonStyle:{
    marginTop:10,
    justifyContent:"space-between",
    paddingHorizontal:16,
    flexDirection:"row"
  },
  iconStyle:{
    flexDirection:"row",
    alignItems:"center",
    gap:3
  },
  iconTextStyle:{
    fontSize:16
  }

})