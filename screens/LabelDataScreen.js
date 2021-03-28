import React, {useState} from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { material } from 'react-native-typography'
import { Divider } from 'react-native-elements';
import Button from "../components/Button";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; 

// This is the base label data screen, should take the user to camera or file navigator

const LabelDataScreen = ({ route, navigation }) => {
	const [image, setImage] = useState(null);

	useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
			console.log(navigation.backBehavior)
			console.log('focused')
            return () => {
				console.log('unfocused')
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

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
        <View style={styles.buttonList}>
			<View style={styles.innterButtonList}>
			<View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 45}}>
				<Text style={material.headline}>Label New Data</Text>
			</View>
			<View style={{marginBottom: '15%', alignContent: 'center',alignItems: 'center'}}>
				<Text style={material.subheading}>Take a picture of something</Text>
				<Button title="Take picture" onPress={() => {navigation.navigate('PictureScreen')}} />
			</View>
			<View style={{alignContent: 'center',alignItems: 'center'}}>
				<Text style={material.subheading}>Upload an image you already have</Text>
				<Button title="Upload from file" onPress={() => pickImage()} />
			</View>
			</View>
		</View>
	{/* Navigation bar */}
	<View style={{height: 60, position: 'absolute', bottom:0, right: 0, left: 0, borderColor:'white', borderWidth:1 , borderTopEndRadius: 20, borderTopLeftRadius: 20, flexDirection: 'row', justifyContent:'center', zIndex: 100}}>
		<TouchableOpacity 
		style={{width: Dimensions.get('window').width * 0.33, alignItems: 'center', justifyContent:'center', height: 60,}}
		onPress={() => navigation.navigate('Home Screen')}
		>
		<MaterialCommunityIcons name="home" color={'white'} size={32} />
		<Text  style={{color:'white'}}>Home</Text>
		</TouchableOpacity>
		<TouchableOpacity 
		style={{width: Dimensions.get('window').width * 0.33, alignItems: 'center', justifyContent:'center', height: 60,}}
		onPress={() => navigation.navigate('Label New Data')}
		>
		<FontAwesome5 name="clipboard-list" color={'black'} size={32} />
		<Text  style={{color:'black'}}>Label Data</Text>
		</TouchableOpacity>
		<TouchableOpacity 
		style={{width: Dimensions.get('window').width * 0.33, alignItems: 'center', justifyContent:'center', height: 60,}}
		onPress={() => navigation.navigate('My Profile')}
		>
		<MaterialIcons name="contacts" color={'white'} size={32} />
		<Text style={{color:'white'}}>My Profile</Text>
		</TouchableOpacity>
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
		width: '100%'
	},
	buttonList: {
		height: '50%',
		justifyContent: 'center',
	},
	innterButtonList: {
		backgroundColor: 'white',
		borderRadius: 20,
		elevation: 5,
		zIndex: 1,
		padding: 10
	}
});

export default LabelDataScreen;
