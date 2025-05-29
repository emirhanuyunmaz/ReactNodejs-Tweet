import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Camera } from 'lucide-react-native';
import { z } from 'zod';
import {Controller , useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from "expo-image-picker"
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters long" }),
  email: z.string().min(2, { message: "Email must be at least 2 characters long" }),
  password: z.string().min(2,{message : "Password min 3"}),
  passwordAgain: z.string().min(2,{message : "Password Again min 3"}),
  description: z.string().min(2,{message : "Description min 3"}),
}).superRefine(({ passwordAgain, password }, ctx) => {
  if (passwordAgain !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['passwordAgain']
    });
  }
});

export default function SignupScreen() {
  const baseUrl = process.env.BASE_URL
// console.log("BAseURL:",baseUrl);

  const navigation = useNavigation() 

  const [image,setImage] = useState(null)

  const [passwordControl,setPasswordControl] = useState(true)
  const [passwordAgainControl,setPasswordAgainControl] = useState(true)


  function loginPage(){
    navigation.goBack();
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const newData= {
      ...data,
      image:image
    }
    try{
      // console.log(newData);
      const res =await axios.post(`${baseUrl}/signup`,newData)
      // console.log(res)

    if(res.status === 201){
        Toast.show({
          type: 'success',
          text1: 'Kullanıcı Kayıt Oldu',
        });
        navigation.goBack()
    }else{
      Toast.show({
          type: 'error',
          text1: 'Bir Hata ile Karşılaşıldı',
        });
    }
    }catch(err){
      console.log("HATA:",err);
      Toast.show({
          type: 'error',
          text1: 'Bir Hata ile Karşılaşıldı',
        });
    }
  };


    async function AddImage(){
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
          alert('Fotoğraf galerisine erişim izni verilmedi!');
          return;
      }
  
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        // allowsEditing:true,
        // aspect:[1,1],
        quality:1,
        base64:true
      })
  
      if(res.canceled){
          console.log("CANCELL",res.assets[0]);  
      }else{
        setImage("data:image/png;base64,"+res.assets[0].base64)
        // setText("data:image/png;base64,"+res.assets[0].base64)
        // console.log("res.assets[0].base64:::",res.assets[0]);
      }
    }


  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container} >
        <Text style={styles.titleStyle} >Signup</Text>

        <TouchableOpacity onPress={AddImage} style={styles.imageContainerStyle} >
          {image == null && <Text><Camera width={32} color={"black"} /></Text>}
          {image != null && <Image style={styles.imageStyle} source={{uri:image}}  />}
        </TouchableOpacity>

        <View style={styles.inputContainer} >
          <View>
            <Text style={styles.labelStyle} >Ad</Text>
            <Controller
              control={control}
              name="name"
              
              render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                  style={[styles.inputStyle,errors.name && styles.errorBorderStyle]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ad"
              />
              )}
            />
            {errors.name && <Text style={styles.errorMessageStyle} >{errors.name.message}</Text>}
          </View>

          <View>
            <Text style={styles.labelStyle} >Soyad</Text>
            <Controller
              control={control}
              name="surname"
              
              render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                  style={[styles.inputStyle,errors.surname && styles.errorBorderStyle]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Soyad"
              />
              )}
            />
            {errors.surname && <Text style={styles.errorMessageStyle} >{errors.surname.message}</Text>}
          </View>

          <View>
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
            {errors.email && <Text style={styles.errorMessageStyle} >{errors.email.message}</Text>}
          </View>

          <View>
            <Text style={styles.labelStyle} >Password</Text>
            <View style={[styles.inputStyle,errors.password && styles.errorBorderStyle,{flexDirection:"row",alignItems:"center"}]}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                  style={{flex:1}}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Password"
                  secureTextEntry={passwordControl}
                  />
                )}
                />
                <TouchableOpacity onPress={() => setPasswordControl(!passwordControl)} >
                  <Text>
                    {passwordControl ? <Eye color={`black`} size={24} />:<EyeOff color={`black`} size={24} />}
                  </Text>
                </TouchableOpacity>
              </View>
            {errors.password && <Text style={styles.errorMessageStyle} >{errors.password.message}</Text>}
          </View>
          
          <View>
            <Text style={styles.labelStyle} >Password Tekrar </Text>
            <View style={[styles.inputStyle,errors.passwordAgain && styles.errorBorderStyle,{flexDirection:"row",alignItems:"center"}]} >
              <Controller
                control={control}
                name="passwordAgain"
                
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={{flex:1}}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Password"
                    secureTextEntry={passwordAgainControl}
                />
                )}
              />
                <TouchableOpacity onPress={() => setPasswordAgainControl(!passwordAgainControl)} >
                  <Text>
                    {passwordAgainControl ? <Eye color={`black`} size={24} />:<EyeOff color={`black`} size={24} />}
                  </Text>
                </TouchableOpacity>
              </View>
            {errors.passwordAgain && <Text style={styles.errorMessageStyle} >{errors.passwordAgain.message}</Text>}
          </View>
          
          <View>
            <Text style={styles.labelStyle} >Açıklma </Text>
            <Controller
              control={control}
              name="description"
              
              render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                  style={[styles.inputStyle,errors.description && styles.errorBorderStyle]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Açıklama"
              />
              )}
            />
            {errors.description && <Text style={styles.errorMessageStyle} >{errors.description.message}</Text>}
          </View>

          <View>
            <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.buttonStyle} >
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
  imageStyle:{
    width:128,
    height:128,
    borderRadius:10  
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
    borderRadius:10,
    paddingHorizontal:16
  },
  errorMessageStyle:{
    fontSize:12,
    color:"red"
  },
  errorBorderStyle:{
    borderColor:"red"
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