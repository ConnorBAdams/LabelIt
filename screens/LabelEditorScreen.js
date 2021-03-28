import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, FlatList } from "react-native";
import Button from "../components/Button";
import Svg, { Circle, Rect, SvgUri, Image, Polygon, Text as SVGText } from "react-native-svg";
import { material } from 'react-native-typography'
import { Input } from "react-native-elements";
import firebase, { auth } from "firebase";
import "firebase/firestore";

// This screen is where the user actually labesl the image

const LabelEditorScreen = ({ route, navigation }) => {
    const [pos, setPos] = useState([]);
    const [mode, setMode] = useState(0);
    const [layout, setLayout] = useState(0);
	const [wipLabel, setWIPLabel] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [savedLabels, setSavedLabels] = useState([]);

    const { imageURI, uriOnly } = route.params;
	console.log(imageURI)

	// Upload the image to firebase then add the item to firestore	
	const uploadToBackend = () => {
		var userId = firebase.auth().currentUser.uid;

		Promise.all( 
			putStorageItem({uri: imageURI, firebaseURL: "Images/" + userId + "/" + imageURI.substring(imageURI.lastIndexOf('/') + 1 ) })
			)
		.then((url) => {
			console.log('Test: ', url)
		})

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
        console.log();
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
	<View style={styles.container}>
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
    <View onTouchStart={(e) => handleBoundingBox(e)} style={{width: '100%', height: '70%', borderColor: 'black', borderWidth: 1, borderRadius: 20}} >
      <Svg height="100%" width="100%" viewbox="0 0 100 100">
		<Image
			onLayout={event => {console.log('OnLayout: ', event.nativeEvent.layout);  setLayout(event.nativeEvent.layout)}}
			width="100%"
			height="100%"
			style={{backgroundColor: 'grey'}}
			href={{uri: imageURI}}
		/>
			{mode == 0 &&
				<Rect 
				onPress={(e) => {console.log('press', e.nativeEvent)}}
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
			{savedLabels.map((value) => {
				if (value.type == 0) {
					console.log(value)
					return(
						<View>
					<Rect 
					onPress={(e) => {console.log('press', e.nativeEvent)}}
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
	<View>
		<Text style={material.subheading}>Selection mode: {(mode == 0) ? "Rectangle" : "Polygon"}</Text>
	</View>
      	<Button onPress={() => {mode == 0 ? setMode(1) : setMode(0)}} title='TOGGLE selection mode' />
		{pos.length > 0 &&
		<View style={{flexDirection:'row', width: '100%', justifyContent: 'space-around', marginTop: 10}}>
		<Button onPress={() => setPos([])} title='RESET' iconName="trash"  buttonStyle={{backgroundColor: '#cc412f'}} />
		<Button onPress={() => setModalVisible(true)} title='Done!' iconName="check" />
		</View>
		}
		{pos.length == 0 &&
		<View style={{flexDirection:'row', width: '100%', justifyContent: 'space-around', marginTop: 10}}>
		<Button onPress={() => uploadToBackend()} title='Upload!' iconName="check" />
		</View>
		}
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
});

export default LabelEditorScreen;
