import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useUserFollowerListQuery } from '../store/contactApi/contactApiSlicer'
import UserProfileCard from '../components/UserProfileCard'
import { useRoute } from '@react-navigation/native'


// Takipçi listesi gösterilmesi . //
export default function UserFollowerListScreen() {
    const route = useRoute()
    const id = route.params?._id
    const [data , setData] = useState([])
    const getUserFollowerList = useUserFollowerListQuery(id) //takipçi listesi

    return (
        <View style={{flex:1}} >
            <FlatList
                style={{flex:1,marginTop:24,marginHorizontal:20 }}
                data={getUserFollowerList.data?.data}
                keyExtractor={item => item._id}
                renderItem={({item}) => <UserProfileCard {...item} />}
            />
    
        </View>
  )
}

const styles = StyleSheet.create({})