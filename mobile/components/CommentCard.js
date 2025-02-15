import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function CommentCard() {
    const baseUrl = process.env.BASE_URL
    function UserProfileOnClick(){
    
    
    }
  return (
    <View style={styles.container} >
        <View style={styles.userAndTag}>
        
            <TouchableOpacity onPress={UserProfileOnClick} style={styles.userContainerStyle}>
                <Image style={styles.userProfileImageStyle} source={{uri:`https://randomuser.me/api/portraits/men/78.jpg`}}/>
                <View>
                <Text style={styles.userNameStyle} >User Name</Text>
                <Text  >12/12/2025</Text>
                </View>
            </TouchableOpacity>
            

            <Text style={styles.tagStyle}>MUTLU</Text>
        </View>
        
        <Text style={styles.postContainer}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga exercitationem laudantium explicabo possimus similique illo eaque nulla dolore asperiores aliquid aspernatur aut dolor repudiandae, eius ratione molestias consectetur, consequuntur assumenda.
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        borderWidth:2,
        borderColor:"gray",
        marginHorizontal:10,
        borderRadius:10,
        marginTop:10,
        paddingHorizontal:10,
        paddingVertical:10
    },
    // userProfileContainerStyle:{
    //     justifyContent
    // },
    userProfileImageStyle:{
        width:52,
        height:52,
        borderRadius:100
    },
    userAndTag:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    userContainerStyle:{
        flexDirection:"row",
        alignItems:"center",
        gap:12,
        marginBottom:10
    },
    tagStyle:{
        fontWeight:"700",
        fontSize:16,
        marginTop:5,
        paddingRight:15
    },
    postContainer:{
        marginHorizontal:20
    },
})