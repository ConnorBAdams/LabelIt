import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import firebase, { auth } from "firebase";
import "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { material } from 'react-native-typography'
import { Avatar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons'; 

// This is the profile screen

const ProfileScreen = ({ navigation }) => {
	const [userInfo, setUserInfo] = useState(null)

	useFocusEffect(
		React.useCallback(() => {
			GetUserData()
			return () => {
				console.log("Focused Profile Screen");
			};
		}, [])
	);

    const GetUserData = () => {
        var userId = firebase.auth().currentUser.uid;
        firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then(function (snapshot) {
                setUserInfo(snapshot.data())
                console.log(snapshot.data())
            })
    }

	const getTitle = () => {
		var matches = userInfo.name.match(/\b(\w)/g); // ['J','S','O','N']
		var acronym = matches.join(''); // JSON
		console.log(acronym)
		return acronym
	}

	const signOut = () => {
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	  }).catch((error) => {
		// An error happened.
	  });
	}

	if (userInfo != null)
	return (
	<View style={styles.container}>
		
		<View style={styles.header}>
			<View style={{alignContent:'center', alignItems: 'center'}}>
				{ userInfo.profilePic == '' &&
				<Avatar 
					size="xlarge"
					style={{backgroundColor:'#2fcc76', width: 150, height: 150, borderRadius: 100}} 
					onPress={() => console.log("Works!")}
					rounded
					title={getTitle()} >
						<MaterialIcons name="edit" size={45} color="black" style={styles.imgEditIcon} />
				</Avatar>
				}
				{userInfo.profilePic != '' &&
				<Avatar 
				size="xlarge"
				style={{backgroundColor:'#2fcc76', width: 150, height: 150, borderRadius: 100}} 
				onPress={() => console.log("Works!")}
				rounded
				title={'test'} >
					<MaterialIcons name="edit" size={45} color="black" style={styles.imgEditIcon} />
			</Avatar>
				}
			</View>

		<Text style={[material.headline, {marginTop: 15}]}>Hey, {userInfo.name}!</Text>

		</View>
		<View style={styles.body}>

		</View>
		<View style={styles.footer}>
			<View>
        	<Button onPress={() => signOut()} title="Sign out" buttonStyle={{backgroundColor: '#cc412f'}} />
			</View>
		</View>
    </View>
	);
	else return (
	<View style={styles.container}>
    </View>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		height: '20%',
		width: '80%',
		padding: 25,
		alignContent:'center', 
		alignItems: 'center'
	},
	body: {
		height: '60%',
		width: '80%',
		padding: 25

	},
	footer: {
		height: '20%',
		width: '80%',
		padding: 25
	},
	imgEditIcon: {
		position: 'absolute', 
		right: 0, 
		bottom: 0,
		backgroundColor: 'rgba(125, 125, 125, 0.5)', 
		borderRadius: 100, 
		padding: 5
	}
});

export default ProfileScreen;
