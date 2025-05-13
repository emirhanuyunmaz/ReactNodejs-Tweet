import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SendEmail from '../components/SendEmail'
import ChangePassword from '../components/ChangePassword'

export default function ResetPassword() {
    const [position,setPosition] = useState(0) 


  return (
    <View style={styles.container}>
      
    {
        position == 0 && <SendEmail setPosition={setPosition} />
    }
    {
        position == 1 && <ChangePassword/>
    }
    
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})