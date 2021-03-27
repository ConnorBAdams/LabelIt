import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CameraModule from '../components/CameraModule'

// Take picture for labeling

const PictureScreen = ({ navigation }) => {
	return (
	<View style={styles.container}>
		<View style={{height:"100%"}}>
		<CameraModule />
        </View>
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

export default PictureScreen;
