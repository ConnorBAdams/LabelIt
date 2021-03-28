import React, {useState} from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { material } from 'react-native-typography'
import { Divider } from 'react-native-elements';
import Button from "../components/Button";
import * as ImagePicker from 'expo-image-picker';

// This is the base label data screen, should take the user to camera or file navigator

const LabelDataScreen = ({ navigation }) => {
	const [image, setImage] = useState(null);


	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.All,
		  allowsEditing: true,
		  quality: 1,
		});
	
		console.log(result);
	
		if (!result.cancelled) {
		  setImage(result.uri);
		  navigation.navigate('LabelEditor', {imageURI: result.uri, uriOnly: true} )
		}
	  };
	
	return (
	<ImageBackground style={styles.container} source={require('../assets/bgTest3.png')}>
		<View style={styles.headerContainer}>
		<Text style={[material.headline, {marginBottom: '25%'}]}>LABEL NEW DATA</Text>
		</View>
        <View style={styles.buttonList}>
		<View style={{marginBottom: '15%', alignContent: 'center',alignItems: 'center'}}>
			<Text style={material.subheading}>Take a picture of something</Text>
			<Button title="Take picture" onPress={() => {navigation.navigate('PictureScreen')}} />
		</View>
		<View style={{alignContent: 'center',alignItems: 'center'}}>
			<Text style={material.subheading}>Upload an image you already have</Text>
			<Button title="Upload from file" onPress={() => pickImage()} />
		</View>
		</View>
    </ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	headerContainer: {
		height: '10%',
		alignItems: 'center',
		width: '100%',
		marginBottom: '20%'
	},
	buttonList: {
		height: '45%',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: 20,
		elevation: 5,
		zIndex: 1,
		padding: 10
	}
});

export default LabelDataScreen;
