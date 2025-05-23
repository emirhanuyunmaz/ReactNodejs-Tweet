import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { z } from 'zod';
import { useChangePasswordMutation } from '../store/userApi/userApiSlicer';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';

const schema = z.object({
  code: z.string().min(2, { message: "Kodu giriniz" }),
  password: z.string().min(2, { message: "Şifrenizi giriniz" }),
  passwordAgain: z.string().min(2, { message: "Şifrenizi Tekrar giriniz" }),
}).superRefine(({ passwordAgain, password }, ctx) => {
  if (passwordAgain !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Şifreler aynı olmalı",
      path: ['passwordAgain']
    });
  }
})

export default function ChangePassword() {
    const navigation = useNavigation()
    const [email,setEmail] = useState("")
    const [changePassword,resChangePassword] = useChangePasswordMutation()
    const [passwordControl,setPasswordControl] = useState(true)
    const [passwordAgainControl,setPasswordAgainControl] = useState(true)
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log(data);
        const newData = {
            ...data,
            email:email
        }
        await changePassword(newData).unwrap()
        .then(() => {
            Toast.show({
                type: 'success',
                text1: 'Şifre değiştirildi',
            });
            navigation.goBack()
        }).catch((err) => {
            console.log("ERR:",err);
            Toast.show({
                type: 'error',
                text1: 'Lütfen Tekrar Deneyin',
            });
        })
        // navigation.navigate("Tab")
    };
    
    async function getEmail(){
        const data_email = await AsyncStorage.getItem("email")
        setEmail(data_email)
    } 
    useLayoutEffect(() => {
        getEmail()
    },[])
  return (
    <View style={styles.container} >
        <View style={styles.emailStyle} >
            <Text>Email adresi :</Text>
            <Text style={styles.emailText} >{email}</Text>
        </View>
        <View style={styles.inputListContainer} >

            <View style={styles.inputContainerStyle} >
                <Text style={styles.labelStyle} >Kod</Text>
                <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                    style={[styles.inputStyle,errors.code && styles.errorBorderStyle]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Kod"
                    />
                )}
                />
            {errors.code&& <Text style={styles.errorTextStyle} >Kodu Giriniz</Text>}
            </View>
   
            <View style={styles.inputContainerStyle} >
                <Text style={styles.labelStyle} >Şifre</Text>
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
                        placeholder="Şifre"
                        secureTextEntry={passwordControl}
                        />
                    )}
                    />

                    <TouchableOpacity onPress={() => setPasswordControl(!passwordControl)} >
                        <Text>
                            {passwordControl ? <Eye color={`black`} size={24} /> : <EyeOff color={`black`} size={24} />} 
                        </Text>
                    </TouchableOpacity>
                </View>
            {errors.password&& <Text style={styles.errorTextStyle} >Şifre Giriniz</Text>}
            </View>

            <View style={styles.inputContainerStyle} >
                <Text style={styles.labelStyle} >Şifre Tekrar</Text>
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
                        placeholder="Şifre Tekrar"
                        secureTextEntry={passwordAgainControl}
                        />
                    )}
                    />
                    <TouchableOpacity onPress={() => setPasswordAgainControl(!passwordAgainControl)} >
                        <Text>
                            {passwordAgainControl ? <Eye color={`black`} size={24} /> : <EyeOff color={`black`} size={24} />}
                        </Text>
                    </TouchableOpacity>
                </View>
            {errors.passwordAgain&& <Text style={styles.errorTextStyle} >{errors.passwordAgain.message}</Text>}
            </View>
            <View>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.buttonStyle} >
                    <Text style={styles.buttonTextStyle} >Gönder</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        paddingHorizontal:24
        // flex:1,
        // justifyContent:"center",
        // alignItems:"center"
    },
    emailStyle:{
        flexDirection:"row",
        gap:10,
        marginHorizontal:"auto"
    },
    emailText:{
        fontWeight:"bold"
    },
    inputListContainer:{
        gap:24
    },
    inputContainerStyle:{
        // width:"100%"
    },
    inputStyle:{
        paddingHorizontal:16,
        width:"100%",
        borderWidth:1,
        borderColor:"black",
        borderRadius:10
    },
    errorBorderStyle:{
        borderWidth:1,
        borderColor:"red",
    },
    labelStyle:{
        fontWeight:"bold",
        marginStart:8
    },
    buttonStyle:{
        backgroundColor:"dodgerblue",
        paddingHorizontal:16,
        paddingVertical:10,
        borderRadius:10

    },
    buttonTextStyle:{
        color:"white",
        textAlign:"center"
    },
    errorTextStyle:{
        color:"red",
        marginStart:10
    }
})