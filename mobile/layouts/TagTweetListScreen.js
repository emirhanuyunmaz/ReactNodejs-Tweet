import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ClassificationTagList from '../components/ClassificationTagList'
import TweetCard from '../components/TweetCard'

export default function TagTweetListScreen() {
  return (
    <ScrollView>
        <View>
        <Text style={styles.titleStyle} >#Hello</Text>
        <ClassificationTagList/>
            <View>
                <TweetCard/>
                <TweetCard/>
                <TweetCard/>
                <TweetCard/>
                <TweetCard/>
                <TweetCard/>
            </View>

        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    titleStyle:{
        fontSize:32,
        fontWeight:"500",
        textAlign:"center"
    }
})