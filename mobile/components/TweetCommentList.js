import { StyleSheet, Text, View } from 'react-native'
import TweetCard from './TweetCard';
import { CornerDownRight } from 'lucide-react-native';
import CommentCard from './CommentCard';

export default function TweetCommentList({tweetCommentList}) {
    console.log("TCL:",tweetCommentList);
    

  return (
    <View>
      <TweetCard {...tweetCommentList.tweet} />
      <View style = {styles.tweetCommentContainer}>
        <Text><CornerDownRight size={32} color={"black"}/></Text>
        <View style={styles.tweetCommentCard} >
            <CommentCard createAt={tweetCommentList.createAt} tag={tweetCommentList.tag} text={tweetCommentList.text} userId={tweetCommentList.userId} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    tweetCommentContainer:{
        flexDirection:"row",
        alignItems:"center",
        width:"90%",
        marginStart:"auto",
        // paddingEnd:10
    },
    tweetCommentCard:{
        width:"85%"
    }
})