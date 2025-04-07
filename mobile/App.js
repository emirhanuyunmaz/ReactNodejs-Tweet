import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  StyleSheet, Text, View } from 'react-native';
import LoginScreen from './layouts/LoginScreen';
import SignupScreen from './layouts/SignupScreen';
import HomeScreen from './layouts/HomeScreen';
import {  Bell, House, Mail, Search, User } from 'lucide-react-native';
import ProfileScreen from './layouts/ProfileScreen';
import UserListScreen from './layouts/UserListScreen';
import NotificationScreen from './layouts/NotificationScreen';
import SingleTweetScreen from './layouts/SingleTweetScreen';
import MessageScreen from './layouts/MessageScreen';
import { Provider } from 'react-redux';
import { store } from './store/reduxStore';
import SearchScreen from './layouts/SearchScreen';
import { StatusBar } from 'expo-status-bar';
import UserProfileScreen from './layouts/UserProfileScreen';
import TaskListScreen from './layouts/TaskListScreen';
import SettingsScreen from './layouts/SettingsScreen';
import { MenuProvider } from 'react-native-popup-menu';
import AddTweetScreen from './layouts/AddTweetScreen';
import TaskUpdateScreen from './layouts/TaskUpdateScreen';
import CommentScreen from './layouts/CommentScreen';
import TagTweetListScreen from './layouts/TagTweetListScreen';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from './components/LoadingComponent';
import Toast from 'react-native-toast-message';
import { context, ContextProvider } from './context/context';
import UserFollowerListScreen from './layouts/UserFollowerListScreen';
import UserFollowedListScreen from './layouts/UserFollowedListScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();


function TabNavigate(){
    const user_context = useContext(context)
    console.log("Bildirim Sayısı :",user_context.notificationLength);
    useEffect(() => {
      user_context.connectSocket()
    },[])
    

  return (<Tab.Navigator screenOptions={{
    sceneStyle:{
      backgroundColor:"#fff"
    }
  }} >
    <Tab.Screen name="Home"  component={HomeScreen} options={{
      headerShown:false,
      tabBarLabel:"Tweet",
      tabBarIcon:() => <House color={"black"} size={32} />
    }} />
    <Tab.Screen name="Search" component={SearchScreen} options={{
      headerShown:false,
      tabBarLabel:"Ara",
      tabBarIcon:() => <Search color={"black"} size={32} />
    }} />

    <Tab.Screen name="UserList" component={UserListScreen} options={{
      headerShown:false,
      tabBarLabel:"Mesaj",
      tabBarIcon:() => <Mail color={"black"} size={32} />
    }} />
    <Tab.Screen name="Notification" component={NotificationScreen} options={{
      headerShown:false,
      tabBarLabel:"Bildirim",
      tabBarIcon:() => <View style={styles.notificationStyle} ><Bell color={"black"} size={32} /><Text>{user_context.notificationLength}</Text></View>
    }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{
      headerShown:false,
      tabBarLabel:"Profil",
      tabBarIcon:() => <User color={"black"} size={32} />
    }} />
  </Tab.Navigator>)
}

function LoggedIn(){

  return <Provider store={store}>
    <ContextProvider>
  <MenuProvider>
  <StatusBar
    animated={true}
    backgroundColor="#BFDBFF"
  />
  <NavigationContainer>
      <Stack.Navigator screenOptions={{contentStyle:{
        backgroundColor:"#fff"
      }}} >
        <Stack.Screen options={{headerShown:false}}  name="Tab" component={TabNavigate} />
        <Stack.Screen name="SingleTweet" component={SingleTweetScreen} />
        <Stack.Screen name="Tasks" component={TaskListScreen} />
        <Stack.Screen name="AddTweet" component={AddTweetScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="TaskUpdate" component={TaskUpdateScreen} />
        <Stack.Screen options={{headerShown:false}} name="Message" component={MessageScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="Comment" component={CommentScreen} />
        <Stack.Screen name="TagTweetList" component={TagTweetListScreen} />
        <Stack.Screen name="UserFollowerList" component={UserFollowerListScreen} />
        <Stack.Screen name="UserFollowedList" component={UserFollowedListScreen} />
        <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}}  name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </MenuProvider>
    </ContextProvider>
    <Toast/>
  </Provider>
}

function NotLoggedIn(){
  return <Provider store={store}>
  <ContextProvider>
<MenuProvider>
<StatusBar
  animated={true}
  backgroundColor="#BFDBFF"
/>
<NavigationContainer>
    <Stack.Navigator screenOptions={{contentStyle:{
      backgroundColor:"#fff"
    }}} >
      <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
      <Stack.Screen options={{headerShown:false}}  name="Signup" component={SignupScreen} />
      <Stack.Screen options={{headerShown:false}}  name="Tab" component={TabNavigate} />
      <Stack.Screen name="SingleTweet" component={SingleTweetScreen} />
      <Stack.Screen name="Tasks" component={TaskListScreen} />
      <Stack.Screen name="AddTweet" component={AddTweetScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TaskUpdate" component={TaskUpdateScreen} />
      <Stack.Screen options={{headerShown:false}} name="Message" component={MessageScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="TagTweetList" component={TagTweetListScreen} />
      <Stack.Screen name="UserFollowerList" component={UserFollowerListScreen} />
      <Stack.Screen name="UserFollowedList" component={UserFollowedListScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  </MenuProvider>
  </ContextProvider>
  <Toast/>
</Provider>
}

export default function App() {

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
    }
    setIsLoading(false)
  }

  useEffect(() => {
    isLogin()
  },[])

  const baseUrl = process.env.BASE_URL

  console.log(baseUrl);

  if(loginControl){
    return (isLoading ? <LoadingComponent/> :<LoggedIn/>)
  } else{
    return ( isLoading ? <LoadingComponent/> : <NotLoggedIn/>)
  }
  
  // return (
  //   <Provider store={store}>
  //     <MenuProvider>
  //     <StatusBar
  //       animated={true}
  //       backgroundColor="#BFDBFF"
  //     />
  //     <NavigationContainer>
  //         <Stack.Navigator screenOptions={{contentStyle:{
  //           backgroundColor:"#fff"
  //         }}} >
  //           <Stack.Screen options={{headerShown:false}}  name="Tab" component={TabNavigate} />
  //           <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
  //           <Stack.Screen options={{headerShown:false}}  name="Signup" component={SignupScreen} />
  //           <Stack.Screen name="SingleTweet" component={SingleTweetScreen} />
  //           <Stack.Screen name="Tasks" component={TaskListScreen} />
  //           <Stack.Screen name="AddTweet" component={AddTweetScreen} />
  //           <Stack.Screen name="Settings" component={SettingsScreen} />
  //           <Stack.Screen name="TaskUpdate" component={TaskUpdateScreen} />
  //           <Stack.Screen name="Message" component={MessageScreen} />
  //           <Stack.Screen name="UserProfile" component={UserProfileScreen} />
  //           <Stack.Screen name="Comment" component={CommentScreen} />
  //           <Stack.Screen name="TagTweetList" component={TagTweetListScreen} />
  //         </Stack.Navigator>
  //       </NavigationContainer>
  //       </MenuProvider>
  //     </Provider>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationStyle:{
    flexDirection:"row"
  }
});
