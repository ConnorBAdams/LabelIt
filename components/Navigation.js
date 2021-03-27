import React, { useState } from "react";
import * as firebase from "firebase";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; 

//#region Screen Imports
import LandingPageScreen from '../screens/LandingPageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ProjectScreen from '../screens/ProjectScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import LoadingScreen from '../screens/LoadingScreen'
import MakerAccCreateScreen from '../screens/MakerAccCreateScreen'
import BuyerAccCreateScreen from '../screens/BuyerAccCreateScreen'
import SignInScreen from '../screens/SignInScreen'
import GigScreen from "../screens/GigScreen";
import FindGigScreen from "../screens/FindGigScreen";
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
                tabBarLabel: 'Projects',
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="clipboard-list" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen name="My Gigs"
            component={GigNavigator}
            options={{
                tabBarLabel: 'Gigs',
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="hammer" color={color} size={size} />
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
            <LoginStack.Screen name="MakerCreateScreen" options={{headerShown: false}} component={MakerAccCreateScreen} />
            <LoginStack.Screen name="BuyerCreateScreen" options={{headerShown: false}} component={BuyerAccCreateScreen} />
            <LoginStack.Screen name="SignInScreen" options={{headerShown: false}} component={SignInScreen} />
        </LoginStack.Navigator>
    );
};


const HomeStack = createStackNavigator();
const HomeNavigator = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
            <HomeStack.Screen name="ProjectScreen" component={ProjectScreen} />
            <HomeStack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
        </HomeStack.Navigator>
    );
};

const LabelStack = createStackNavigator();
const LabelNavigator = () => {
    return (
        <LabelStack.Navigator>
            <LabelStack.Screen name="Home" options={{headerShown: false}} component={GigScreen} />
            <LabelStack.Screen name="ProjectScreen" component={ProjectScreen} />
            <LabelStack.Screen name="FindGigScreen" component={FindGigScreen} />
        </LabelStack.Navigator>
    );
};


const ProfileStack = createStackNavigator();
const ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="ProfileScreen"
             component={ProfileScreen} 
             options={{ headerShown: false }} />
            </ProfileStack.Navigator>
    );
};
