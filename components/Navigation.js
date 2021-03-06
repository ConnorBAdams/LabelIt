import React, { useState } from "react";
import * as firebase from "firebase";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
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


// So I just destroyed this, instead of using a bottom tab navigator I want to use 
// A stack navigator and disguise it as a bottom tab navigator
// My rationale is I want the stack navigator screen transition animations

const Tab = createStackNavigator();
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
                headerShown: false,
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
                headerShown: false,
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
            <Tab.Navigator 
            initialRouteName="Home"            
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
                tabBarOptions={{
                    activeTintColor: 'black',
                    inactiveTintColor: 'lightgray',
                    inactiveBackgroundColor: 'rgba(125,125,125,0.25)',
                    activeBackgroundColor: 'rgba(125,125,125,0.25)',
                    //inactiveBackgroundColor: 'transparent',
                    style: {
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'transparent',
                        elevation: 0,
                        borderTopLeftRadius: 15,
                        borderTopEndRadius: 15,
                        height: 55,
                        borderTopColor: 'white',
                        borderRightWidth: 1,
                        borderRightColor: 'white',
                        borderLeftWidth: 1,
                        borderLeftColor: 'white',
                    }   
                }
            }>
            <Tab.Screen name="Home Screen"
            component={HomeNavigator}
            options={{
                tabBarLabel: 'My Data',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="clipboard-list" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen name="Label New Data"
            component={LabelNavigator}
            options={{
                tabBarLabel: 'Label Data',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="format-textbox" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen name="My Profile"
            options={{headerShown: false}}
            component={ProfileNavigator}
            options={{
                tabBarLabel: 'My Profile',
                headerShown: false,
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
            <HomeStack.Screen name="LabelEditor"  
            options={{title:"Label Editor", 
            headerStyle: {backgroundColor: 'transparent', elevation: 0 },
            headerTransparent: {
                position: 'absolute',
                backgroundColor: 'transparent',
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0
              }
            }} 
            component={LabelEditorScreen} />
        </HomeStack.Navigator>
    );
};

const LabelStack = createStackNavigator();
const LabelNavigator = () => {
    return (
        <LabelStack.Navigator>
            <LabelStack.Screen name="Home" options={{headerShown: false}} component={LabelDataScreen} />
            <LabelStack.Screen name="LabelEditor" 
            options={{title:"Label Editor",
            headerStyle: {backgroundColor: 'transparent', elevation: 0 },
            headerTransparent: {
                position: 'absolute',
                backgroundColor: 'transparent',
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0
              }
            }}  
            component={LabelEditorScreen} />
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
