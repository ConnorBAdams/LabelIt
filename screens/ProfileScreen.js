import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, Alert, ImageBackground } from "react-native";
import Button from "../components/Button";
import firebase, { auth } from "firebase";
import "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { material } from 'react-native-typography'
import { Avatar, Input } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons'; 

// This is the profile screen

const ProfileScreen = ({ navigation }) => {
	const [userInfo, setUserInfo] = useState(null)
	const [teamInfo, setTeamInfo] = useState(null)
	const [enteredTeamID, setEnteredTeamID] = useState('')
	const [modalVisible, setModalVisible] = useState(false);

	useFocusEffect(
		React.useCallback(() => {
			GetUserData()
			return () => {
				console.log("Focused Profile Screen");
			};
		}, [])
	);


	// This is a WIP but I want to work on other things first
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.All,
		  allowsEditing: true,
		  quality: 1,
		});
	
		console.log(result);
	
		if (!result.cancelled) {
			
		}
	};

    // Single upload to firebase storage
    // Assumes an item.uri where the image is and an item.firebaseURL for storage location
    const putStorageItem = async (item) => {
		var userId = firebase.auth().currentUser.uid;
        console.log('Item received for uploading', item)
        var metadata = {
            contentType: "image/jpeg",
		};
        const response = await fetch(item.uri, metadata);
        const blob = await response.blob();
        // the return value will be a Promise which will return a URL when finished
        return firebase.storage().ref(item.firebaseURL).put(blob)
            .then((snapshot) => {
            console.log('Successful Upload:', item.firebaseURL )
            blob.close()
						
			firebase
            .firestore()
            .collection("users")
            .doc(userId)
			.collection('labeledImages')
            .add({labels: savedLabels, image: item.firebaseURL});
			navigation.popToTop()
            return(item.firebaseURL)
            }).catch((error) => {
            console.log('One failed:', item, error.message)
        });
        
    }

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
				if (snapshot.data().teamID != '')
					GetTeamData(snapshot.data())
            })
    }

	const GetTeamData = (user) => {
		firebase
		.firestore()
		.collection("groups")
		.doc(user.teamID)
		.get()
		.then(function (snapshot) {
			setTeamInfo(snapshot.data())
			console.log(snapshot.data())
		})
	}

	const getTitle = () => {
		var matches = userInfo.name.match(/\b(\w)/g); // ['J','S','O','N']
		var acronym = matches.join(''); // JSON
		return acronym
	}

	const signOut = () => {
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	  }).catch((error) => {
		// An error happened.
	  });
	}

	const setUserDataWithBackend = (tempData, userID) => {
		setUserInfo(null)
		firebase
		.firestore()
		.collection("users")
		.doc(userID)
		.set(tempData)
		setUserInfo(tempData)
	}


	const createTeam = () => {
		var userId = firebase.auth().currentUser.uid;

		console.log('Got: ', enteredTeamID)

		firebase
		.firestore()
		.collection("groups")
		.add({name: enteredTeamID, members: [userId]})
		.then((snapshot) => {
			console.log(snapshot.id)
			let tempUserData = userInfo;
			tempUserData.teamID = snapshot.id
			setUserDataWithBackend(tempUserData, userId)
			setModalVisible(false)
		})

	}

	const joinById = () => {
		try {
			firebase
			.firestore()
			.collection('groups')
			.doc(enteredTeamID)
			.get().then((snapshot) => {
				var userId = firebase.auth().currentUser.uid;

				const joinID = snapshot.id
				let tempUserData = userInfo
				userInfo.teamID = joinID
				setUserDataWithBackend(tempUserData, userId)

				let tempGroupData = snapshot.data()
				if (tempGroupData.members != undefined && tempGroupData.members.length > 0)
					tempGroupData.members = [...tempGroupData.members, userId ]
				else
					tempGroupData.members = [userId]
				firebase
				.firestore()
				.collection('groups')
				.doc(joinID)
				.set(tempGroupData)

				GetTeamData()
			})
		} catch(err) {
			console.log(err.message)
			Alert.alert('Group does not exist, double check your spelling and capitalization.')
		}
	}

	const leaveTeam = () => {
		var userId = firebase.auth().currentUser.uid;

		let tempGroupID = teamInfo
		tempGroupID.members = tempGroupID.members.filter(id => id != userId)
		firebase
		.firestore()
		.collection("groups")
		.doc(userInfo.teamID)
		.set(tempGroupID)


		let tempUserData = userInfo
		tempUserData.teamID = ''
		setUserDataWithBackend(tempUserData, userId)
	}

	if (userInfo != null)
	return (
        <ImageBackground style={styles.container} source={require('../assets/bgTest5.png')}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={[styles.modalText, material.headline]}>
                                What is your team name?
                            </Text>
                            <View style={{ width: "100%" }}>
                                <Input
                                    label="Team Name"
                                    inputStyle={{ color: "black" }}
                                    leftIcon={{
                                        type: "MaterialIcons",
                                        name: "edit",
                                    }}
                                    onChangeText={(text) => setEnteredTeamID(text)}
                                />
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Button
                                    title="Cancel"
                                    onPress={() => setModalVisible(false)}
                                    buttonStyle={{ backgroundColor: "#cc412f" }}
                                />
                                <Button
                                    title="Confirm"
                                    onPress={() => createTeam()}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            <View style={styles.header}>
                <View style={{ alignContent: "center", alignItems: "center" }}>
                    {userInfo.profilePic == "" && (
                        <Avatar
                            size="xlarge"
                            style={{
                                backgroundColor: "#2fcc76",
                                width: 150,
                                height: 150,
                                borderRadius: 100,
                            }}
                            rounded
                            title={getTitle()}
                        >
                            {/* <MaterialIcons name="edit" size={45} color="black" style={styles.imgEditIcon} /> */}
                        </Avatar>
                    )}
                    {userInfo.profilePic != "" && (
                        <Avatar
                            size="xlarge"
                            style={{
                                backgroundColor: "#2fcc76",
                                width: 150,
                                height: 150,
                                borderRadius: 100,
                            }}
                            onPress={() => console.log("Works!")}
                            rounded
                            title={"test"}
                        >
                            <MaterialIcons
                                name="edit"
                                size={45}
                                color="black"
                                style={styles.imgEditIcon}
                            />
                        </Avatar>
                    )}
                </View>
                <Text style={[material.headline, { marginTop: 15 }]}>
                    Hey, {userInfo.name}!
                </Text>
            </View>
            <View style={styles.body}>

                {userInfo.teamID == "" && ( // user is not in a team
                    <View>
                        <Text style={[material.subheading, { marginTop: 45 }]}>
                            You're not part of a team!
                        </Text>
                        <Text style={[material.subheading, { marginTop: 5 }]}>
                            Join a team by entering the team ID:
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Input
                                label="Team ID"
                                inputStyle={{ color: "black" }}
                                leftIcon={{
                                    type: "antdesign",
                                    name: "team",
                                }}
                                onChangeText={(text) => setEnteredTeamID(text)}
                            />
                            <Button
                                iconName="check"
								onPress={() => joinById()}
                                buttonStyle={{
                                    height: 50,
                                    width: 55,
									borderRadius: 100,
                                    justifyContent: "center",
                                }}
                            />
                        </View>
                        <Text style={[material.subheading, { marginTop: 5 }]}>
                            Or create a new team:
                        </Text>
                        <View
                            style={{ alignItems: "center", marginBottom: 15 }}
                        >
                            <Button
                                title="Create Team"
                                buttonStyle={{ width: "60%" }}
                                onPress={() => setModalVisible(true)}
                            />
                        </View>
                    </View>
                )}
                {userInfo.teamID != "" && (
                    <View style={styles.teamCard}>
						<Text style={[material.headline, { marginTop: 15 }]}>
							Team: {(teamInfo != null ? teamInfo.name : '')}
						</Text>
                        <Text style={[material.subheading, { marginTop: 15 }]}>
                            ID: {userInfo.teamID}
                        </Text>
                        <Text style={[material.subheading, { marginTop: 30 }]}>
                            If you want to leave your team:
                        </Text>
                        <View
                            style={{ alignItems: "center", marginBottom: 15 }}
                        >
                            <Button
                                title="Leave Team"
                                buttonStyle={{
                                    backgroundColor: "#cc412f",
                                    width: "60%",
                                }}
                                onPress={() => leaveTeam()}
                            />
                        </View>
                    </View>
                )}
                <View
                    style={{
                        alignItems: "center",
						marginTop: 20
                    }}
                >
                    <Button
                        onPress={() => signOut()}
                        title="Sign out"
                        buttonStyle={{
                            backgroundColor: "#cc412f",
                            width: "50%",
                        }}
                    />
                </View>
            </View>
			
        </ImageBackground>
    );
	// Haven't gotten firestore info yet
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
		height: '35%',
		width: '80%',
		padding: 25,
		alignContent:'center', 
		alignItems: 'center',
	},
	body: {
		height: '50%',
		width: '80%',
		padding: 25,
	},
	imgEditIcon: {
		position: 'absolute', 
		right: 0, 
		bottom: 0,
		backgroundColor: 'rgba(125, 125, 125, 0.5)', 
		borderRadius: 100, 
		padding: 5
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	  },
	modalView: {
		margin: 20,
		width: Dimensions.get('window').width * 0.9,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	  },
	  textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: 'center',
	  },
	  buttonList: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 50,
        marginHorizontal: 20,
    },
	teamCard: {
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 10,
		elevation: 5,
		zIndex: 1
	}
});

export default ProfileScreen;
