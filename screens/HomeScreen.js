import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, Dimensions } from "react-native";
import { material } from 'react-native-typography'
import { useFocusEffect } from "@react-navigation/native";
import firebase, { auth } from "firebase";
import "firebase/firestore";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

// This is the basic home screen

const HomeScreen = ({ navigation }) => {
	const [userData, setUserData] = useState(null)
	const [groupData, setGroupData] = useState(null)
	const [userUploads, setUserUploads] = useState(null)
	const [groupUploads, setGroupUploads] = useState(null)

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
                setUserData(snapshot.data())
                console.log(' User: ' + snapshot.data())
				if (snapshot.data().teamID != '')
					GetTeamData(snapshot.data())
            })
			try {
				firebase
				.firestore()
				.collection("users")
				.doc(userId)
				.collection('labeledImages')
				.get()
				.then(function (snapshot) {
					console.log(' User uploads: ')
					let wipList = []
					snapshot.forEach((doc) => {
						console.log(doc.id, doc.data())
						wipList = [...wipList, {id: doc.id, 
							firebaseURL: doc.data().image, 
							labels: doc.data().labels } ]
					})
					setUserUploads(wipList)
				})
			} catch (err) { 
				console.log(err.message)
			}

	}

	const GetTeamData = (user) => {
		firebase
		.firestore()
		.collection("groups")
		.doc(user.teamID)
		.get()
		.then(function (snapshot) {
			setGroupData(snapshot.data())
			console.log(' Group: ' + snapshot.data())
		})
	}


	const _renderItem = ({item, index}) => {
		const tapEvent = () => {
			console.log('Tapped on: ', item, index)
		}
		console.log(item)
		return (
			<View style={styles.renderItem}>
				<TouchableOpacity onPress={() => tapEvent()}>
					<Image uri={(item.uri != undefined) ? {uri: item.uri} : null} style={styles.renderItemImage} />
				</TouchableOpacity>
			</View>
		)
	}
	

	return (
	<View style={styles.container}>
		<Text style={[material.headline, {marginLeft: 10}]}>Your Labeled Data:</Text>
		<View>
			{ (userData != null && userUploads != null) &&
				<View>
					<FlatList
                        data={userUploads}
                        renderItem={_renderItem}
                        keyExtractor={(item) => item.id}
                        initialNumToRender={10}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={6}
                        numColumns={3}
                    />
				</View>
			} 
			{  (userData == null || userUploads == null) &&
				<View style={styles.loadingView}>
					<Text style={material.subheading}>Loading...</Text>
					<ActivityIndicator size='large' color='#2fcc76' />
				</View>
			}
		</View>
		<Text style={[material.headline, {marginLeft: 10}]}>Your Group's Data:</Text>
		<View>
			{ (groupData != null && groupUploads != null && groupData != -1 ) &&
				<View>
					
				</View>
			}
			{ (groupData == -1 ) &&
			<View style={styles.loadingView}>
				<Text style={material.headline}>You aren't in a group!</Text>
				<Text style={material.subheading}>To join or create one just go to your profile! </Text>
			</View>
			}
			{ (userData == null || groupUploads == null ) &&
				<View style={styles.loadingView}>
					<Text style={material.subheading}>Loading...</Text>
					<ActivityIndicator size='large' color='#2fcc76' />
				</View>
			}
		</View>
	</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "space-around",
	},
	loadingView: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	renderItem: {
		width: Dimensions.get('window').width * 0.25, 
		height: Dimensions.get('window').width * 0.25,
		marginHorizontal: '4%',
		marginVertical: '2.5%'
	},
	renderItemImage: {
		backgroundColor: 'rgba(125, 125, 125, 0.5)', 
		width: '100%', 
		height: '100%',
		borderRadius: 20
	}
});

export default HomeScreen;
