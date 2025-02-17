import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function CommentCard({userId,tag,text,createAt}) {
    const baseUrl = process.env.BASE_URL
    function UserProfileOnClick(){
    
    
    }
  return (
    <View style={styles.container} >
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
        
        <Text style={styles.postContainer}>
            {text}
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