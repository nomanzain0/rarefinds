import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ThemedText } from '../ThemedText';

interface buttonProps {
    isActive: boolean;
    text: string;
    handlePress: () => void;
}

const CatagoryButton: React.FC<buttonProps> = ({ isActive, text, handlePress }) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={[styles.button, isActive ? styles.activeButton : styles.inactiveButton]}
            onPress={handlePress}
        >
            <ThemedText style={isActive ? styles.activeText : styles.inactiveText}>{text}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20, // You can adjust the radius for a rounded effect
        marginRight: 10,
        paddingHorizontal: 16,
    },
    activeButton: {
        backgroundColor: 'black',
    },
    inactiveButton: {
        backgroundColor: 'transparent', // or whatever color you want for inactive state
    },
    activeText: {
        color: 'white',
        fontFamily: 'SpaceMono', // Assuming 'SpaceMono' is a valid font family
    },
    inactiveText: {
        color: 'black', // Adjust the color for inactive state
        fontFamily: 'SpaceMono',
    },
});

export default CatagoryButton;
