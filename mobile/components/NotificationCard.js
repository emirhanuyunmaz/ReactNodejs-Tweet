import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Check, X } from 'lucide-react-native';
import { useNotificationFollowAcceptMutation, useNotificationFollowRejectMutation } from '../store/contactApi/contactApiSlicer';

export default function NotificationCard({transactionUser,process,followProcess}) {
  // const baseUrl = process.env.BASE_URL
  const [notificationFollowAccept,resNotificationFollowAccept] = useNotificationFollowAcceptMutation()
  const [notificationFollowReject,resNotificationFollowReject] = useNotificationFollowRejectMutation()


  console.log("::CARD::");
  console.log(transactionUser);
  console.log(process);
  console.log(followProcess);
  // console.log(`http://192.168.1.22:3000/${transactionUser.image}`);
  
  async function FollowAcceptOnClick(){
    const body ={
        userId:transactionUser._id
    }
    await notificationFollowAccept(body)
    // getAllNotification.refetch()
  }

  
  async function FollowRejectOnClick(){
    const body ={
        userId:transactionUser._id
    }
    await notificationFollowReject(body)
    getAllNotification.refetch()
  }

  return (
    <View style={styles.container} >
      <Image style={styles.imageStyle} source={{uri:`http://192.168.1.22:3000/${transactionUser.image}`}} />
      <View>
        <Text style={styles.userNameStyle} >{transactionUser.name} {transactionUser.surname}</Text>
        {
        process == "follow" &&
        <View style={styles.followContainerStyle} >
            {
              followProcess == "none" &&
              <>
                <Text style={styles.infoStyle} >Takip İstegi Attı</Text>
                <View style={{flexDirection:"row", gap:24}} >
                  <TouchableOpacity onPress={FollowAcceptOnClick} >
                    <Text><Check size={32} color={"black"} /></Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={FollowRejectOnClick} >
                    <Text><X  size={32} color={"black"} /></Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            {
              followProcess == "accept" && <Text style={styles.infoStyle} >Takip İsteğini kabul Ettiniz</Text>
            }
            {
              followProcess == "reject" && <Text style={styles.infoStyle} >Takip İsteğini Reddettiniz</Text>
            }
        </View>
        }
        {
         process == "tweetComment" &&
        <View>
            <Text style={styles.infoStyle} >Gönderinize yorum yaptı</Text>
        </View>
        }
        
        {process == "like" && <Text style={styles.infoStyle}> Gönderinizi beğendi</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#BFDBFF",
    flexDirection:"row",
    borderRadius:10,
    marginTop:10,
    paddingHorizontal:10,
    marginHorizontal:10,
    paddingVertical:5,
    alignItems:"center",
    gap:5
  },
  imageStyle:{
    width:60,
    height:60,
    borderRadius:100,
  },
  userNameStyle:{
    fontWeight:"bold",
    fontSize:20
  },
  textStyle:{
    fontSize:16
  },
  followContainerStyle:{
    width:"90%",
    flexDirection:"row",
    justifyContent:"space-between",
    gap:20
  },
  infoStyle:{
    fontSize:20
  },
})