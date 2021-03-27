import React, { useState } from "react";
import { StyleSheet, Text, View, ToastAndroid, Alert } from "react-native";
import Button from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { material } from "react-native-typography";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import firebase, { auth } from "firebase";
import "firebase/firestore";

// this screen is used to create accounts or log in the user

const Screen = ({ route, navigation }) => {
    const [email, setEmail] = useState(null);
    const [pass, setPass] = useState(null);
    const [confpass, setConfPass] = useState(null);
    const [name, setName] = useState(null);

    const { mode } = route.params;

    const submitData = async () => {
		if (email == null || pass == null || mode=='create' && confpass == null || mode=='create' && name == null) {
			ToastAndroid.show('Form is incomplete, please review it!', ToastAndroid.SHORT)
		} else if (pass != confpass && mode=='create') {
			ToastAndroid.show('Passwords don\'t match, plase check them!', ToastAndroid.SHORT)
		} else {
			if (mode == 'create') {
				try {
					let response = await auth()
					.createUserWithEmailAndPassword(email, pass)
					if (response.additionalUserInfo.isNewUser) {
						var user = response.user;
						firebase.firestore()
						.collection("users")
						.doc(user.uid)
						.set({
							email: email,
							name: name,
							createdAt: Date.now(),
							lastLoggedIn: Date.now(),
							profilePic: "",
							aboutMe: "",
						});
					}
				} catch (e) {
					Alert.alert(e.message);
					console.error(e.message);
				}
			}
			else if (mode == 'signin') {
				console.log("SIGN IN")
				let response = await auth()
				.signInWithEmailAndPassword(email, pass)
			}
		}
	};

    return (
        <LinearGradient
            colors={["#542fcc", "white"]}
            start={{ x: 0.2, y: 0.5 }}
            end={{ x: 1, y: 1.75 }}
            style={styles.container}
        >
            {mode == "create" && ( // Create account code
                <View style={styles.form}>
                    <Input
                        label="Email"
                        inputStyle={{ color: "white" }}
                        leftIcon={{
                            type: "MaterialIcons",
                            name: "email",
                        }}
						onChangeText={(text) => setEmail(text)}
                    />
                    <Input
                        label="Password"
                        inputStyle={{ color: "white" }}
                        secureTextEntry={true}
                        leftIcon={{
                            type: "font-awesome",
                            name: "lock",
                        }}
						onChangeText={(text) => setPass(text)}
                    />
                    <Input
                        label="Confirm Password"
                        inputStyle={{ color: "white" }}
                        secureTextEntry={true}
                        leftIcon={{
                            type: "font-awesome",
                            name: "lock",
                        }}
						onChangeText={(text) => setConfPass(text)}
                    />
                    <Input
                        label="Name"
                        inputStyle={{ color: "white" }}
                        leftIcon={{
                            type: "MaterialIcons",
                            name: "person",
                        }}
						onChangeText={(text) => setName(text)}
                    />
                </View>
            )}
            {mode == "signin" && ( // Signin
                <View style={styles.form}>
                    <Input
                        label="Email"
                        inputStyle={{ color: "white" }}
                        leftIcon={{
                            type: "MaterialIcons",
                            name: "email",
                        }}
						onChangeText={(text) => setEmail(text)}
                    />
                    <Input
                        label="Password"
                        inputStyle={{ color: "white" }}
                        secureTextEntry={true}
                        leftIcon={{
                            type: "font-awesome",
                            name: "lock",
                        }}
						onChangeText={(text) => setPass(text)}
                    />
                </View>
            )}
            <View style={styles.confirmBtn}>
                <Button
                    title="Confirm"
                    onPress={() => {
                        submitData();
                    }}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        height: "85%",
        width: "75%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    confirmBtn: {
        height: "15%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
});

export default Screen;
