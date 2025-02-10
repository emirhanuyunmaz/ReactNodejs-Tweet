import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Heart, MessageCircle } from 'lucide-react-native'

export default function TweetCard() {
  console.log("AAA:",process.env.BASE_URL);
  

  return (
    <View style={styles.container}>
      <View style={styles.userAndTag}>
        <View style={styles.userContainerStyle}>
          <Image style={styles.userProfileImageStyle} source={{uri:`https://randomuser.me/api/portraits/men/78.jpg`}}/>
          <View>
            <Text style={styles.userNameStyle} >User Name</Text>
            <Text  >12/12/2025</Text>
          </View>
        </View>
        <Text style={styles.tagStyle}>MUTLU</Text>
      </View>
      {/* <Image style={styles.postImageContainer} source={{uri:`https://randomuser.me/api/portraits/men/78.jpg`}}/> */}
      <Text style={styles.postContainer}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga exercitationem laudantium explicabo possimus similique illo eaque nulla dolore asperiores aliquid aspernatur aut dolor repudiandae, eius ratione molestias consectetur, consequuntur assumenda.
      </Text>
      <View style={styles.buttonStyle}>
        <TouchableOpacity>
            <Heart size={28} color={"black"} />
        </TouchableOpacity>

        {/* <TouchableOpacity>
            <Heart size={28} fill={"red"} color={"red"} />
        </TouchableOpacity> */}
        
        <TouchableOpacity>
            <MessageCircle size={28} color={"black"} />
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
    borderRadius:10
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
  }

})