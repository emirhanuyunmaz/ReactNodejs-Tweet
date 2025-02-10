import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  StyleSheet, Text, View } from 'react-native';
import LoginScreen from './layouts/LoginScreen';
import SignupScreen from './layouts/SignupScreen';
import HomeScreen from './layouts/HomeScreen';
import { AlignLeft, Bell, House, Mail, Search, User } from 'lucide-react-native';
import TagListScreen from './layouts/TagListScreen';
import ProfileScreen from './layouts/ProfileScreen';
import UserListScreen from './layouts/UserListScreen';
import NotificationScreen from './layouts/NotificationScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();


function TabNavigate(){
  return (<Tab.Navigator>
    <Tab.Screen name="Home"  component={HomeScreen} options={{
      headerShown:false,
      tabBarLabel:"Tweet",
      tabBarIcon:() => <House color={"black"} size={32} />
    }} />
    <Tab.Screen name="Search" component={TagListScreen} options={{
      headerShown:false,
      tabBarLabel:"Ara",
      tabBarIcon:() => <Search color={"black"} size={32} />
    }} />

    <Tab.Screen name="Message" component={UserListScreen} options={{
      headerShown:false,
      tabBarLabel:"Mesaj",
      tabBarIcon:() => <Mail color={"black"} size={32} />
    }} />
    <Tab.Screen name="Notification" component={NotificationScreen} options={{
      headerShown:false,
      tabBarLabel:"Bildirim",
      tabBarIcon:() => <View style={styles.notificationStyle} ><Bell color={"black"} size={32} /><Text>10</Text></View>
    }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{
      headerShown:false,
      tabBarLabel:"Profil",
      tabBarIcon:() => <User color={"black"} size={32} />
    }} />
  </Tab.Navigator>)
}

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}}  name="Tab" component={TabNavigate} />
          <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerShown:false}}  name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
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
