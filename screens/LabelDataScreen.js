import React, {useState} from "react";
import { StyleSheet, Text, View } from "react-native";
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
		  navigation.navigate('LabelEditor', {imageURI: image} )
		}
	  };
	
	return (
	<View style={styles.container}>
		<View style={styles.headerContainer}>
		<Text style={[material.headline, {marginBottom: '25%'}]}>LABEL NEW DATA</Text>
		</View>
        <View style={styles.buttonList}>
		<View style={{marginBottom: '15%', alignContent: 'center',alignItems: 'center'}}>
			<Text style={material.subheading}>Take a picture of the world</Text>
			<Button title="Take picture" onPress={() => {navigation.navigate('PictureScreen')}} />
		</View>
		<View style={{marginBottom: '15%', alignContent: 'center',alignItems: 'center'}}>
			<Text style={material.subheading}>Upload an image you already have</Text>
			<Button title="Upload from file" onPress={() => pickImage()} />
		</View>
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
	headerContainer: {
		height: '10%',
		alignItems: 'center',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		width: '100%'
	},
	buttonList: {
		height: '75%',
		justifyContent: 'center'
	}
});

export default LabelDataScreen;
