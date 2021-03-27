import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

// This is a basic loading screen

const Screen = ({ navigation }) => {
	return (<View style={styles.container}>
		<ActivityIndicator size="large" color="#2fcc76" />
		<Text>Loading...</Text>
	</View>);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Screen;
