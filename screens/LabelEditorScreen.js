import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, FlatList, ScrollView, Alert, ImageBackground } from "react-native";
import Button from "../components/Button";
import Svg, { Circle, Rect, SvgUri, Image, Polygon, Text as SVGText } from "react-native-svg";
import { material } from 'react-native-typography'
import { Input } from "react-native-elements";
import firebase, { auth } from "firebase";
import "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

// This screen is where the user actually labesl the image

const LabelEditorScreen = ({ route, navigation }) => {
    const [pos, setPos] = useState([]);
    const [mode, setMode] = useState(0);
    const [layout, setLayout] = useState(0);
	const [wipLabel, setWIPLabel] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [savedLabels, setSavedLabels] = useState([]);
	const [canEdit, setCanEdit] = useState(true)
	const [wipComment, setWIPComment] = useState('')
	const [comments, setComments] = useState([])

    const { imageURI, uriOnly } = route.params;
	console.log(imageURI)

	useFocusEffect(
		React.useCallback(() => {
			if (!uriOnly) {
				setSavedLabels(imageURI.labels)
				setCanEdit(imageURI.userOwned)
				setComments(imageURI.comments)
			}
			return () => {
				console.log("Focused Profile Screen");
			};
		}, [])
	);

	// Upload the image to firebase then add the item to firestore	
	const uploadToBackend = () => {
		var userId = firebase.auth().currentUser.uid;
		if (!uriOnly) {
			updateStorageItem()
		}
		else {
			Promise.all( 
				putStorageItem({uri: imageURI, firebaseURL: "Images/" + userId + "/" + imageURI.substring(imageURI.lastIndexOf('/') + 1 ) })
				)
			.then((url) => {
				console.log('Test: ', url)
			})
		}
	}

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

	const updateStorageItem = () => {
		var userId = firebase.auth().currentUser.uid;
		firebase
		.firestore()
		.collection("users")
		.doc(userId)
		.collection('labeledImages')
		.doc(imageURI.id)
		.set({labels: savedLabels, image: imageURI.firebaseURL, comments: (comments != undefined) ? comments : ''})
		.then(() => 
		navigation.popToTop())
	}

	const deleteLabel = (item) => {
		setPos([])
		console.log(item)
		Alert.alert('Delete this label?', 
		'Delete this label? This will only take effect if you save after deleting in case you change your mind!',
		[
			{
			  text: "Cancel",
			  onPress: () => console.log("Cancel Pressed"),
			  style: "cancel"
			},
			{ text: "OK", onPress: () => confirmDelete(item) }
		  ],
		  { cancelable: false })
	}

	const confirmDelete = (item) => {
		let tempLabels = savedLabels
		tempLabels = tempLabels.filter((newItem) => newItem != item)
		setSavedLabels(tempLabels)
	}

	// TODO: FINISH THIS AND SYNC IT TO BACKEND
	const sendComment = () => {
		let comment = {text: wipComment, poster: firebase.auth().currentUser.uid}
		if (comments != undefined && comments.length > 0)
			setComments([ ...comments, comment])
		else
			setComments([comment])
	}

	const setLabelAndSave = (label) => {
		let finalLabel = {
			label: (label) ? label :wipLabel.toLowerCase(),
			pos: pos, 
			type: mode
		}
		setPos([])
		setWIPLabel('')
		if (savedLabels.length == 0) {
			setSavedLabels([finalLabel])
		} else {
			setSavedLabels([...savedLabels, finalLabel])
		}
		setModalVisible(false)
	}
	
    const _renderButton = ({item}) => {
        return (
            <Button 
            title={item.label} 
			buttonStyle={{backgroundColor:'#5f29c2'}}
            onPress={() =>  setLabelAndSave(item.label)} />
        )
    }

    const handleBoundingBox = (e) => {
        console.log("touchMove", e.nativeEvent);
        if (!canEdit) {
			console.log('User can\'t edit' )
			return
		}

        if (mode == 0) {
            console.log("in rect selection mode");

			let xPos = e.nativeEvent.locationX >= layout.x ? e.nativeEvent.locationX - layout.x : 0; // clamp
            if (xPos > layout.x + layout.width) xPos = layout.x + layout.width;
            let yPos = e.nativeEvent.locationY >= layout.y ? e.nativeEvent.locationY - layout.y : 0;
            if (yPos > layout.y + layout.height) yPos = layout.y + layout.height;


            if (pos.length == 0) {
                setPos([{ x: xPos, y: yPos }]);
                console.log({ x: xPos, y: yPos });
            } else {
                setPos([pos[0], { x: xPos, y: yPos }]);
                console.log([...pos, { x: xPos, y: yPos }]);
            }
        } else if (mode == 1) {
            console.log("in poly selection mode");
			let xPos = e.nativeEvent.locationX >= layout.x ? e.nativeEvent.locationX - layout.x : 0; // clamp
            if (xPos > layout.x + layout.width) xPos = layout.x + layout.width;
            let yPos = e.nativeEvent.locationY >= layout.y ? e.nativeEvent.locationY - layout.y : 0;
            if (yPos > layout.y + layout.height) yPos = layout.y + layout.height;

            if (pos.length == 0) {
                setPos([{ x: xPos, y: yPos }]);
                console.log({ x: xPos, y: yPos });
            } else {
                setPos([...pos, { x: xPos, y: yPos }]);
                console.log([...pos, { x: xPos, y: yPos }]);
            }
        }
    };

	const getPoly = (positions) => {
		let result = positions.map(point => `${point.x + layout.x},${point.y + layout.y}`).join(' ')
		console.log(result)
		return result
	  }

    return (
	<ImageBackground  style={styles.container} source={require('../assets/bgTest2.png')}>
	<View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, material.headline]}>Set a Label</Text>
			<View style={{width: '100%'}}>
			<Input
				label="Label"
				inputStyle={{ color: "black" }}
				leftIcon={{
					type: "MaterialIcons",
					name: "edit",
				}}
				onChangeText={(text) => setWIPLabel(text)}
			/>
			</View>
			{ savedLabels.length > 0 &&
			<View style={{marginBottom: 15}}>
            <Text style={[styles.modalText, material.subheading]}>Previously used:</Text>
			<View style={styles.buttonList}>
                    <FlatList
                        data={savedLabels.filter((x, i, a) => a.indexOf(x).label === i.label)}
                        horizontal={true}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        showsHorizontalScrollIndicator={false}
                        renderItem = {_renderButton}
                        keyExtractor={(option)=> option.label}
                    />
                </View>
			</View>
		}
			<View style={{flexDirection: 'row'}}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} buttonStyle={{backgroundColor: '#cc412f'}} />
            <Button title="Confirm" onPress={() => setLabelAndSave()} />
			</View>
          </View>
        </View>
      </Modal>

    </View>
    <View onTouchStart={(e) => handleBoundingBox(e)} style={{width: '100%', height: '70%', borderColor: 'black', borderWidth: 1, borderRadius: 20, marginTop: -20}} >
      <Svg height="100%" width="100%" viewbox="0 0 100 100">
		<Image
			onLayout={event => {console.log('OnLayout: ', event.nativeEvent.layout);  setLayout(event.nativeEvent.layout)}}
			width="100%"
			height="100%"
			style={{backgroundColor: 'grey'}}
			href={(uriOnly) ? {uri: imageURI} : {uri: imageURI.uri}}
		/>
			{mode == 0 &&
				<Rect 
				x={pos.length > 0 ? `${pos[0].x + layout.x}` : "0"} 
				y={pos.length > 0 ? `${pos[0].y + layout.y}` : "0"} 
				width={pos.length > 1 ? `${pos[1].x - pos[0].x}`  : "0"} 
				height={pos.length > 1 ? `${pos[1].y - pos[0].y}`  : "0"}
				stroke="red" strokeWidth="2" fill="rgba(125, 125, 125, 0.25)" style={{zIndex: 10}} />
			}
			{(mode == 1 && pos.length > 2) && 
				<Polygon
				points={getPoly(pos)}
				fill="rgba(125, 125, 125, 0.25)"
				stroke="red"
				strokeWidth="2"
				/>
			}
			{layout != 0 &&
			savedLabels.map((value) => {
				if (value.type == 0) {
					console.log(value)
					console.log(value.pos[0], layout.x)
					return(
						<View>
					<Rect 
					onLongPress={(e) => {console.log('Long press'); deleteLabel(value) }}
					x={`${value.pos[0].x + layout.x}`}
					y={`${value.pos[0].y + layout.y}`} 
					width={`${value.pos[1].x - value.pos[0].x}`} 
					height={ `${value.pos[1].y - value.pos[0].y}`}
					stroke="red" strokeWidth="2" fill="rgba(125, 125, 125, 0.25)" style={{zIndex: 10}} />
					<SVGText 
					x={`${value.pos[0].x + layout.x}`} 
					y={`${value.pos[0].y + layout.y - 5}`} 
					fontSize="15"
					fill="red"
					 >{value.label}</SVGText>
					</View>
					)
				} else if (value.type == 1) {
					return (
						<View>
						<Polygon
						onLongPress={(e) => {console.log('Long press'); deleteLabel(value) }}
						points={getPoly(value.pos)}
						fill="rgba(125, 125, 125, 0.25)"
						stroke="red"
						strokeWidth="2"
						/>
						<SVGText 
						x={`${value.pos[0].x + layout.x}`} 
						y={`${value.pos[0].y + layout.y - 5}`} 
						fontSize="15"
						fill="red"
						 >{value.label}</SVGText>
						 </View>
					)
				}
			})
			}
      		</Svg> 
    </View>
	
	<ScrollView style={{width: '100%'}}>
		
		{ canEdit && 
		<View style={styles.scrollInner}>
		<View>
			<Text style={material.subheading}>Selection mode: {(mode == 0) ? "Rectangle" : "Polygon"}</Text>
		</View>
      	<Button onPress={() => {mode == 0 ? setMode(1) : setMode(0)}} title='TOGGLE selection mode' />
		{ pos.length > 0 &&
		<View style={{flexDirection:'row', width: '100%', justifyContent: 'space-around', marginTop: 10}}>
			<Button onPress={() => setPos([])} title='RESET' iconName="trash"  buttonStyle={{backgroundColor: '#cc412f'}} />
			<Button onPress={() => setModalVisible(true)} title='Done!' iconName="check" />
		</View>
		}
		{ pos.length == 0 &&
		<View style={{flexDirection:'row', width: '100%', justifyContent: 'space-around', marginTop: 10}}>
			{ uriOnly && <Button onPress={() => uploadToBackend()} title='Upload!' iconName="check" />}
			{ !uriOnly && <Button onPress={() => uploadToBackend()} title='Save!' iconName="save" />}
		</View>
		}
		</View>}
		{ !uriOnly &&
		<View style={{justifyContent: 'flex-start'}}>
			<Text style={material.headline}>Comments:</Text>
			<View style={styles.commentBox}>
				{ comments != undefined &&  comments.length > 0 && comments.map(comment => {
					console.log(comment)
					return(
						<View>
							<Text>{comment.text}</Text>
							<Text>By: {comment.poster == firebase.auth().currentUser.uid ? "You" : comment.poster}</Text>
						</View>
					)
				})}
				{comments == undefined &&
				<Text style={material.subheading}>There are no comments on this! {"\n"}Be the first to leave one below:</Text>
				}
			</View>
			<Input
				label="Leave a comment:"
				inputStyle={{ color: "black" }}
				leftIcon={{
					type: "MaterialIcons",
					name: "edit",
				}}
				onChangeText={(text) => setWIPComment(text)}
				onSubmitEditing={() => sendComment()}
			/>
			</View>
		}
	</ScrollView>
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
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	  },
	  modalView: {
		margin: 20,
		width: Dimensions.get('window').width * 0.75,
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
	scrollInner: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	commentBox: {
		borderWidth: 0.5,
		width: Dimensions.get('window').width * 0.9,
		marginHorizontal: Dimensions.get('window').width * 0.05,
		padding: 20,
		borderRadius: 20,
		borderColor: 'lightgrey'
	},
	bgimage: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
	  },
});

export default LabelEditorScreen;
