import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserProfileCard from './UserProfileCard'

export default function SearchUserList({userList}) {
  return (
    <View style={styles.container} >
      {
        userList?.length > 0 ? userList.map((item) => <UserProfileCard key={item._id} {...item} />) :<Text style={styles.infoStyle} >Aranan Kullanıcı Bulunamadı</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        gap:10,
        paddingHorizontal:10
    },
    infoStyle:{
        textAlign:"center"
    }
})