import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { z } from 'zod';
import { useResetPasswordSendEmailMutation } from '../store/userApi/userApiSlicer';
import Toast from 'react-native-toast-message';

const schema = z.object({
  email: z.string().min(2, { message: "Email giriniz" }),
});


export default function SendEmail({setPosition}) {
    const navigation = useNavigation()
    const [resetPasswordSendEmail,resResetPasswordSendEmail] = useResetPasswordSendEmailMutation()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log(data);
        await AsyncStorage.setItem("email",data.email)
        await resetPasswordSendEmail(data).unwrap()
        .then(() => {
            setPosition(1)
            Toast.show({
                type: 'success',
                text1: 'Mail gönderildi',
            });
            
        }).catch((err) => {
            console.log("Bir hata var :",err);
            
        })
    };

  return (
    <View style={styles.conteiner}>
        <View>
            <Text style={styles.titleStyle} >Parolanızı Sıfırlayın</Text>
            <Text style={styles.descriptionStyle} >Hasabınıza ait email adresini girerek şifre yenilemek için kod alabilirsiniz.</Text>
        </View>
        <View>
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
        {errors.email&& <Text style={styles.errorTextStyle} >Email Adresi Giriniz</Text>}
        </View>
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    conteiner:{
        width:"100%",
        padding:20,
        gap:24

    },
    titleStyle:{
        fontSize:30,
        fontWeight:"bold",
        textAlign:"center"
    },
    descriptionStyle:{
        fontSize:16,
        textAlign:"center"
    },
    inputStyle:{
        width:"100%",
        borderWidth:1,
        borderColor:"black",
        borderRadius:10,
        paddingHorizontal:20
    },
    buttonContainer:{
        backgroundColor:"dodgerblue",
        paddingVertical:10,
        paddingHorizontal:16,
        borderRadius:10,
        marginHorizontal:"auto"
    },
    buttonText:{
        color:"white",
        textAlign:"center",
    },
    errorBorderStyle:{
        borderColor:"red"
    },
    errorTextStyle:{
        marginStart:10,
        color:"red",
    }
})