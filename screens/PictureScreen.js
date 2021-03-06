import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CameraModule from '../components/CameraModule'

// Take picture for labeling

const PictureScreen = ({ navigation }) => {
	return (
	<View style={styles.container}>
		<View style={{height:"92%"}}>
		<CameraModule photoHandler={(img) => navigation.navigate('LabelEditor', {imageURI: img.uri, uriOnly: true})} />
        </View>
    </View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
});

export default PictureScreen;
