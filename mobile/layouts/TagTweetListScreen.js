import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import ClassificationTagList from '../components/ClassificationTagList'
import { useRoute } from '@react-navigation/native'
import { useGetSingleUserTagQuery } from '../store/userApi/userApiSlicer'
import TweetCard from '../components/TweetCard'

export default function TagTweetListScreen() {

    const route = useRoute()
    const tag = route.params?.tag
    const userTag = useGetSingleUserTagQuery(tag)
    const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await userTag.refetch()    
    setRefreshing(false)
  }, []);

  return (
    <View style={styles.container} >
        <View style={styles.container} >
            <Text style={styles.titleStyle} >#{tag}</Text>
            
                <View style={styles.container} >
                    <FlatList
                        ListHeaderComponent={<ClassificationTagList tagList={userTag.data?.tagData} />}
                        data={userTag.data?.data}
                        renderItem={({item}) => <TweetCard {...item} />}
                        keyExtractor={item  =>  item._id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </View>

        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    
    titleStyle:{
        fontSize:32,
        fontWeight:"500",
        textAlign:"center"
    }
})