import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { material } from 'react-native-typography'

/*Connor's button because he likes special buttons */

const Button = ({
    style,
    buttonStyle,
    onPress,
    textStyle,
    title,
    iconName,
    iconSize
}) => {
    return (
        <TouchableOpacity
			style={style ? style : [styles.touchableOpacityStyle, buttonStyle]}
            onPress={onPress}
        >
            <View style={styles.innerView}>
                {iconName ? (
                    <Feather
                        style={styles.iconStyle, (title != null)? {paddingRight: 5} : {} }
                        name={iconName}
                        size={(iconSize) ? iconSize : 24}
                        color="white"
                    />
                ) : null}
                <Text style={[styles.touchableOpacityText, textStyle, material.subheadingWhite]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        backgroundColor: "#2fcc76",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        //android
        elevation: 8,
        //ios
        shadowColor: "#000",
        shadowOpacity: 20,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        margin: 5,
    },
    innerView: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "transparent",
        borderColor: "#000",
        paddingHorizontal: 2.5
    },
    touchableOpacityText: {
        color: "#fff",
        fontSize: 18,
        textTransform: "uppercase",
    },
    iconStyle: {
    },
});

export default Button;
