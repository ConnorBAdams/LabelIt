import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import Button from '../components/Button'
import { LinearGradient } from 'expo-linear-gradient';
import { material } from 'react-native-typography'

// This screen is the main landing page when a user first opens the app

const Screen = ({ navigation }) => {
	return (
		<LinearGradient
        colors={['#542fcc', 'white']}
        start={{ x: 0.2, y: 0.5 }}
        end={{ x: 1, y: 1.75 }}
        style={styles.container}
      >
	  <View style={styles.logoHeader}>
			<Image source={require('../assets/Logo.png')} style={{width: '100%', height: '50%'}} />
		</View>
		<View style={styles.buttonList}>
		<Text style={[material.display2White, {marginBottom: '25%'}]}>Welcome!</Text>

		<Text style={material.headlineWhite}>Need an account?</Text>
		<Button title='Create Account' onPress={() => navigation.navigate('AuthScreen', {mode: 'create'})} />
		<Text style={[material.subheadingWhite, {marginTop: '15%'}]}>Or sign in if you have one already!</Text>
		<Button title='Sign In' onPress={() => navigation.navigate('AuthScreen', {mode: 'signin'})} />

		</View>
	</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#542fcc",
		alignItems: "center",
		justifyContent: "center",
	},
	logoHeader: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').width,
		justifyContent: 'center',
		marginVertical: '-15%'
	},
	buttonList:{
		height: (Dimensions.get('window').height - Dimensions.get('window').width) ,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Screen;
