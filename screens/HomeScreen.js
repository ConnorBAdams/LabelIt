import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, Dimensions, ImageBackground } from "react-native";
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
				else
					setGroupData(-1)
            })
			try {
				firebase
				.firestore()
				.collection("users")
				.doc(userId)
				.collection('labeledImages')
				.get()
				.then(function (snapshot) {
					console.log(' User uploads postprocessing')
					var storage = firebase.storage();
					let wipList = []
					const target = snapshot.size
					if (userUploads != null && snapshot.size == userUploads.length)
					{
						console.log('No need to grab again')
						return
					}

					console.log('Target: ', target)
					snapshot.forEach((doc) => {
						console.log(doc.id, doc.data())
						
						// Get the urls from storage
						storage.ref( doc.data().image).getDownloadURL()
						.then((url) => {
							wipList.push({
								id: doc.id, 
								firebaseURL: doc.data().image, 
								labels: doc.data().labels,
								uri: url,
								userOwned: true
							})
							console.log(wipList.length, 'of', target)
							if (wipList.length == target) {
								console.log(wipList.length)
								setUserUploads(wipList)
							}
						})
					})
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
			var userId = firebase.auth().currentUser.uid;
			console.log(' Group: ' + snapshot.data())
			if (snapshot.data().members.length == 1) {
				setGroupUploads([])
				console.log('Setting to []')
			}
			else {
			snapshot.data().members.forEach(member => {
				if (member == userId)
					return
				// Query the member's uploads and get them from storage
				try {
					firebase
					.firestore()
					.collection("users")
					.doc(member)
					.collection('labeledImages')
					.get()
					.then(function (snapshot) {
						console.log(' User uploads postprocessing')
						var storage = firebase.storage();
						let wipList = []
						const target = snapshot.size
						console.log('Target: ', target)
						snapshot.forEach((doc) => {
							console.log(doc.id, doc.data())
							
							// Get the urls from storage
							storage.ref( doc.data().image).getDownloadURL()
							.then((url) => {
								wipList.push({
									id: doc.id, 
									firebaseURL: doc.data().image, 
									labels: doc.data().labels,
									uri: url,
									userOwned: false
								})
								console.log(wipList.length, 'of', target)
								if (wipList.length == target) {
									console.log(wipList.length)
									if (groupUploads != null)
										setGroupUploads([...groupUploads, ...wipList])
									else
										setGroupUploads(wipList)
								}
							})
						})
					})
				} catch (err) { 
					console.log(err.message)
				}

			})
		}
		})
		
	}

	const _renderItem = ({item, index}) => {
		const tapEvent = () => {
			console.log('Tapped on: ', item, index)
			navigation.navigate('LabelEditor', {imageURI: item, uriOnly: false})
		}
		console.log('rendering: ', item.id, item.uri)
		return (
			<TouchableOpacity onPress={() => tapEvent()} style={styles.renderItem}>
				<Image source={{uri: item.uri}} style={styles.renderItemImage} />
			</TouchableOpacity>
		)
	}
	

	return (
	<View style={styles.container}>
		<ImageBackground style={styles.bgimage} source={require('../assets/bgTest.png')}>
		<View style={styles.userDataContainer}>
		<Text style={[material.headline, {marginLeft: 10, marginBottom: 30}]}>Your Labeled Data:</Text>
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
		<View style={styles.groupDataContainer}>
		<Text style={[material.headline, {marginLeft: 10, marginBottom: 30}]}>Your Group's Data:</Text>
			{ (groupData != null && groupUploads != null && groupData != -1 ) &&
				<View>
					{ groupUploads.length == 0 &&
					<Text style={[material.headline, {marginHorizontal: 20}]}>No other uploads in your group than you!</Text>
					}
					{ groupUploads.length > 0 && 
					<FlatList
						data={groupUploads}
						renderItem={_renderItem}
						keyExtractor={(item) => item.id}
						initialNumToRender={10}
						removeClippedSubviews={true}
						maxToRenderPerBatch={10}
						windowSize={6}
						numColumns={3}
					/>
					}

				</View>
			}
			
			{ (groupData == -1 ) &&
			<View style={styles.loadingView}>
				<Text style={material.headline}>You aren't in a group!</Text>
				<Text style={material.subheading}>To join or create one just go to your profile! </Text>
			</View>
			}
			{ (userData == null && groupData != -1 || groupUploads == null && groupData != -1 ) &&
				<View style={styles.loadingView}>
					<Text style={material.subheading}>Loading...</Text>
					<ActivityIndicator size='large' color='#2fcc76' />
				</View>
			}
		</View>
		</ImageBackground>
	</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: 'space-evenly',
	},
	loadingView: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	renderItem: {
		width: Dimensions.get('window').width * 0.25, 
		height: Dimensions.get('window').width * 0.25,
		marginHorizontal: '4%',
		marginVertical: '2.5%',
		elevation: 5,
		zIndex: 1,
		backgroundColor: 'rgba(125, 125, 125, 0.5)', 
		borderRadius: 20,
		borderColor:'white',
		borderWidth: 0,
	},
	renderItemImage: {
		width: '100%', 
		aspectRatio: 1,
		borderRadius: 20,
	},
	userDataContainer: {
		height: Dimensions.get('window').height * 0.4,
		marginTop: '10%',
		backgroundColor: 'white',
		borderRadius: 20,
		elevation: 5,
		width: '95%',
		padding: 5
	},
	groupDataContainer: {
		height: Dimensions.get('window').height * 0.4,
		marginTop: '5%',
		backgroundColor: 'white',
		borderRadius: 20,
		elevation: 5,
		width: '95%',
		padding: 5
		},
	bgimage: {
		flex: 1,
		resizeMode: "cover",
		alignItems: 'center',
		height: '100%'
	  },
});

export default HomeScreen;
