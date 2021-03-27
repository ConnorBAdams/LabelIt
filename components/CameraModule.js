import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

/*Camera view, adds camera, taking pictures, flash, front and back camera support.*/
const CameraModule = (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState("auto");

    useEffect(() => {
        getPermissionAsync();
    });

    const getPermissionAsync = async () => {
        // Camera roll Permission
        const { camerRollStatus } = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY
        );
        // Camera Permission
        const { cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);

        //useState for camera permissions
        if ((camerRollStatus === cameraStatus) === "granted")
            setHasPermission({ hasPermission: camerRollStatus === "granted" });
        else setHasPermission({ hasPermission: camerRollStatus === "denied" });
    };

    //Show text in case user denies access to camera
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const toggleFlash = () => {
        cameraRef.FlashMode = flash === "auto" ? "off" : "auto";
        setFlash(flash === "auto" ? "off" : "auto");
    };

    const takePicture = async () => {
        if (cameraRef) {
            let newPhoto = await cameraRef.takePictureAsync();
            console.log("Picture taken!");
            //console.log(newPhoto);
            props.photoHandler(newPhoto);
        }
    };

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                ratio="16:9"
                flash={"auto"}
                type={type}
                ref={(ref) => {
                    setCameraRef(ref);
                }}
            >
                <View
                    //UI container, should draw over the camera view
                    style={styles.cameraInternalTop}
                >
                    <TouchableOpacity
                        //Button to toggle flash
                        style={styles.cameraTouchable}
                    >
                        <Ionicons
                            name={
                                flash === "auto" ? "ios-flash" : "ios-flash-off"
                            }
                            style={styles.iconStyle}
                            onPress={toggleFlash}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cameraTouchable}
                        onPress={() => {
                            //Camera button to switch front and back camera
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}
                    >
                        <MaterialCommunityIcons name="camera-retake"
                            style={styles.iconStyle}
                        />
                    </TouchableOpacity>
                </View>

                <View
                    style={styles.cameraInternalBottom}
                >
                    <TouchableOpacity
                        //Take picture button
                        style={styles.cameraTouchable}
                        onPress={() => takePicture()}
                    >
                        <Ionicons
                            name="ios-aperture"
                            style={styles.iconStyle}
                        />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    camera: {
        width: "100%",
		aspectRatio: 9/16,
    },
    cameraInternalTop: {
        flexDirection: "row",
        backgroundColor: "transparent",
        justifyContent: "space-between",
        margin: 20,
        paddingTop: 20,
    },
    cameraInternalBottom: {
		position: 'absolute',
		bottom: 20,
		width: '100%',
        flexDirection: "row",
        backgroundColor: "transparent",
        justifyContent: "center",
    },
    cameraTouchable: {
        backgroundColor: "transparent",
    },
    iconStyle: {
        color: "#fff",
        fontSize: 45,
    },
});

export default CameraModule;
