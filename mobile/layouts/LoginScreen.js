import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useUserLoginMutation } from '../store/userApi/userApiSlicer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { context } from '../context/context';

const schema = z.object({
  email: z.string().min(2, { message: "Email must be at least 2 characters long" }),
  password: z.string().min(2,{message : "Password min 3"}),
});


export default function LoginScreen() {
  const user_contex = useContext(context)
  const [login,resLogin] = useUserLoginMutation()
  const navigation = useNavigation()

  const [isLoading,setIsLoading] = useState(false)
  const [loginControl,setLoginControl] = useState(false)

  async function isLogin(){
    setIsLoading(true)
    const data = await AsyncStorage.getItem("access_token")
    console.log(data);
    if(data == null ){
      console.log("Giriş yok");
      setLoginControl(false)
    } else{
      console.log("giriş var");
      setLoginControl(true)
      navigation.navigate("Tab")
    }
    setIsLoading(false)
  }

  useLayoutEffect(() => {
    isLogin()
  },[])


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    const res = await login(data)
    console.log("RESSR:",res);
    // await AsyncStorage.setItem("access_token",res.data.accessToken)
    await user_contex.tokenSave(res.data.accessToken)
    navigation.navigate("Tab")
  };

  function signupPage(){
    navigation.navigate("Signup")
  }

  function resetPassword(){
    navigation.navigate("ResetPassword")
  }

  
  return (
    <View style={styles.container} >
      <View >
        <Text style={styles.titleStyle} >Giriş Yap</Text>
      </View>
      <View style={styles.inputGroupStyle} >
        <View style={styles.inputContainer}>
          <Text style={styles.labelStyle} >Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={[styles.inputStyle,errors.email && styles.errorBorderStyle]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
            />
            )}
        />
        {errors.email && <Text style={styles.errorMessageStyle} >Email Giriniz</Text>}

        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelStyle} >Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={[styles.inputStyle,errors.email && styles.errorBorderStyle]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholder='Password'
            />
            )}
        />
        {errors.password && <Text style={styles.errorMessageStyle} >Şifre Giriniz</Text>}

        </View>
        <TouchableOpacity onPress={resetPassword} style={styles.resetPasswordContainer} >
          <Text style={styles.resetPasswordLink} >Şifremi Unuttum</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={handleSubmit(onSubmit)} >
          <Text style={styles.buttonTextStyle} >Giriş Yap</Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity onPress={signupPage} >
            <Text style={styles.signupButtonStyle} >Üye Ol</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:32,
    marginHorizontal:10,
    justifyContent:"center",
    
  },
  titleStyle:{
    fontSize:32,
    fontWeight:"bold",
    textAlign:"center"
  },
  inputGroupStyle:{
    gap:10
  },
  inputContainer:{

  },
  labelStyle:{
    marginStart:3,
    fontSize:16,
    marginBottom:3,
    fontWeight:"500"
  },
  inputStyle:{
    backgroundColor:"white",
    borderRadius:10,
    borderColor:"gray",
    borderWidth:2,
    paddingHorizontal:12
  },
  errorBorderStyle:{
    borderColor:"red"
  },
  errorMessageStyle:{
    color:"red",
    fontWeight:"600",
    fontSize:12
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
  signupButtonStyle:{
    textAlign:"center",
    fontSize:16
  },
  resetPasswordContainer:{
    marginVertical:10,
    marginStart:10
  },
  resetPasswordLink:{
    color:"dodgerblue"
  }

})