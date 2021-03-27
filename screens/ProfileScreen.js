import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import firebase, { auth } from "firebase";
import "firebase/firestore";

// This is the profile screen

const ProfileScreen = ({ navigation }) => {

	const signOut = () => {
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	  }).catch((error) => {
		// An error happened.
	  });
	}

	return (
	<View style={styles.container}>

        <Button onPress={() => signOut()} title="Sign out" />
    </View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ProfileScreen;
