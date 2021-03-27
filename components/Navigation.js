import React, { useState } from "react";
import * as firebase from "firebase";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; 

//#region Screen Imports
import LandingPageScreen from '../screens/LandingScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';
import LabelDataScreen from '../screens/LabelDataScreen';
import LabelEditorScreen from '../screens/LabelEditorScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PictureScreen from '../screens/PictureScreen';
//#endregion

/*
This is the navigation controller
The goal is to have the drawer navigator in here, the AppNavigator
- This will contain all of the locations within the sidebar
- Each of these can contain deeper navigation
Then each page that requires a deeper navigation will have its own 
stack navigation
Their respective implementation can be returned from this component
*/


const Tab = createBottomTabNavigator();
export default AppNavigator = () => {
    const [loggedIn, setLoggedIn] = useState(-1)

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setLoggedIn(1)
            console.log('Logged in')
        } else {
            setLoggedIn(0)
            console.log('Not logged in')
        }
    });
    if (loggedIn == -1) { // Loading
        return(
            <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home Screen"
            component={LoadingScreen}
            options={{
                tabBarVisible: false,
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
                }}
            />
            </Tab.Navigator>
        )
    }
    else if (loggedIn == 0) { // Not logged in
        return (
            <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home Screen"
            component={LoginNavigator}
            options={{
                tabBarVisible: false,
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
                }}
            />
        </Tab.Navigator>
        )
    } else { // Logged in
        return (
            <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home Screen"
            component={HomeNavigator}
            options={{
                tabBarLabel: 'My Labels',
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="clipboard-list" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen name="Label New Data"
            component={LabelNavigator}
            options={{
                tabBarLabel: 'Label Data',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="format-textbox" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen name="My Profile"
            component={ProfileNavigator}
            options={{
                tabBarLabel: 'My Profile',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="contacts" color={color} size={size} />
                ),
            }}
            />
            </Tab.Navigator>
        )
    }
};

const LoginStack = createStackNavigator();
const LoginNavigator = () => {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen name="LandingPage" options={{headerShown: false}} component={LandingPageScreen} />
            <LoginStack.Screen name="AuthScreen" options={{headerShown: false}} component={AuthScreen} />
        </LoginStack.Navigator>
    );
};


const HomeStack = createStackNavigator();
const HomeNavigator = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        </HomeStack.Navigator>
    );
};

const LabelStack = createStackNavigator();
const LabelNavigator = () => {
    return (
        <LabelStack.Navigator>
            <LabelStack.Screen name="Home" options={{headerShown: false}} component={LabelDataScreen} />
            <LabelStack.Screen name="LabelEditor" options={{title:"Label Editor"}} component={LabelEditorScreen} />
            <LabelStack.Screen name="PictureScreen" options={{title:"Take Picture"}} component={PictureScreen} />
        </LabelStack.Navigator>
    );
};


const ProfileStack = createStackNavigator();
const ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator>
            {/* <ProfileStack.Screen name="ProfileScreen"
             component={ProfileScreen} 
             options={{ headerShown: false }} /> */}
             <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}  />
            </ProfileStack.Navigator>
    );
};
