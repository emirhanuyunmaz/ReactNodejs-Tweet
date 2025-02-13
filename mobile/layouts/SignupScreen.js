import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Camera } from 'lucide-react-native';

export default function SignupScreen() {

  const navigation = useNavigation() 

  function loginPage(){
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }



  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container} >
        <Text style={styles.titleStyle} >Signup</Text>

        <TouchableOpacity style={styles.imageContainerStyle} >
          <Text><Camera width={32} color={"black"} /></Text>
        </TouchableOpacity>

        <View style={styles.inputContainer} >
          <View>
            <Text style={styles.labelStyle} >Ad</Text>
            <TextInput style={styles.inputStyle} placeholder='Ad' />
          </View>

          <View>
            <Text style={styles.labelStyle} >Soyad</Text>
            <TextInput style={styles.inputStyle} placeholder='Soyad' />
          </View>

          <View>
            <Text style={styles.labelStyle} >Email</Text>
            <TextInput style={styles.inputStyle} placeholder='Email' />
          </View>

          <View>
            <Text style={styles.labelStyle} >Password</Text>
            <TextInput style={styles.inputStyle} placeholder='Password' />
          </View>
          
          <View>
            <Text style={styles.labelStyle} >Password Tekrar </Text>
            <TextInput style={styles.inputStyle} placeholder='Password Tekrar' />
          </View>
          
          <View>
            <Text style={styles.labelStyle} >Açıklma </Text>
            <TextInput
                placeholder='Açıklama'
                style={styles.descriptionStyle}
                multiline={true}
                numberOfLines={10}
              />
          </View>

          <View>
            <TouchableOpacity style={styles.buttonStyle} >
              <Text style={styles.buttonTextStyle} >Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={loginPage} >
              <Text style={styles.loginButtonStyle} >Giriş Yap</Text>
            </TouchableOpacity>
          </View>

        </View>

      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingTop:40,
    marginHorizontal:10
  },
  titleStyle:{
    fontSize:32,
    fontWeight:"700",
    marginBottom:10,
    textAlign:"center"
  },
  imageContainerStyle:{
    width:128,
    height:128,
    justifyContent:"center",
    alignItems:"center",
    borderWidth:2,
    borderRadius:10,
    marginBottom:10
  },
  inputContainer:{
    gap:10
  },
  labelStyle:{
    fontWeight:"500",
    marginStart:6,
    fontSize:16,
    marginBottom:3
  },
  inputStyle:{
    backgroundColor:"white",
    borderColor:"gray",
    borderWidth:2,
    borderRadius:10
  },
  descriptionStyle:{
    height:64,
    backgroundColor:"white",
    borderWidth:2,
    borderColor:"gray",
    borderRadius:10,
    textAlignVertical:"top",
    paddingHorizontal:6,
  },
  buttonStyle:{
    backgroundColor:"dodgerblue",
    paddingVertical:10,
    borderRadius:10
  },
  buttonTextStyle:{
    textAlign:"center",
    color:"white"
  },
  loginButtonStyle:{
    textAlign:"center"
  }

})