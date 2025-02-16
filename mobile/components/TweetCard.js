import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Heart, MessageCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native';

export default function TweetCard({text,comments,createdAt,userTag,tag,likes,userId,isImage,userIsFollow}) {
  const baseUrl = process.env.BASE_URL

  const navigation = useNavigation()

  // Yorum sayfasına gönderme işlemi.
  function tweetCommentPage(){
    navigation.navigate("SingleTweet")
  }

  // Kullanıcı profiline gönderme işlemi.
  function UserProfileOnClick(){
    
  }

  function likeTweet(){

  }

  function dislikeTweet(){
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.userAndTag}>
        
        <TouchableOpacity onPress={UserProfileOnClick} style={styles.userContainerStyle}>
          <Image style={styles.userProfileImageStyle} source={{uri:`${baseUrl}/${userId.image}`}}/>
          <View>
            <Text style={styles.userNameStyle} >{userId.name} {userId.surname}</Text>
            <Text  >12/12/2025</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.tagStyle}>{tag.toUpperCase()}</Text>
      </View>

      {isImage ? <Image style={styles.postImageContainer} source={{uri:`${baseUrl}/${text}`}}/>:
      <Text style={styles.postContainer}>
          {text}
      </Text>}
      
      <View style={styles.buttonStyle}>
        

        {userIsFollow ? <TouchableOpacity>
            <View style={styles.iconStyle}>
              <Heart size={28} fill={"red"} color={"red"} />
              <Text style={styles.iconTextStyle}>{likes.length}</Text>
            </View>
        </TouchableOpacity>
        :
        <TouchableOpacity>
          <View style={styles.iconStyle}>
            <Heart size={28} color={"black"} />
            <Text style={styles.iconTextStyle}>{likes.length}</Text>
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
    borderRadius:10
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