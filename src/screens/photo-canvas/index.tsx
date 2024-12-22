import { Button } from "@tamagui/button";
import React, { useEffect } from "react"
import { NativeModules, NativeEventEmitter } from 'react-native';

const { MySwiftUIScreenManager } = NativeModules;

const eventEmitter = new NativeEventEmitter(MySwiftUIScreenManager);

// Listen for events from the SwiftUI view


const triggerNativeEvent = () => {
    MySwiftUIScreenManager.triggerEventFromSwiftUI();
};



const PhotoCanvas = ({ closeScreen }: { closeScreen: Function }) => {

    eventEmitter.addListener('onSwiftUIEvent', (event) => {
        console.log('Received event from SwiftUI:', event);
        closeScreen()
    });

    const handleOnCanvas = () => {
        MySwiftUIScreenManager.presentSwiftUIScreen('Hello from React Native!');
    }
    useEffect(() => {
        MySwiftUIScreenManager.presentSwiftUIScreen('Hello from React Native!');
    }, [])

    return (
        <Button onPress={handleOnCanvas} >Open Canvas</Button>
    )

}

export default PhotoCanvas