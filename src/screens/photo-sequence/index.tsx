import { H2, SizableText } from '@tamagui/text';
import { View } from '@tamagui/core';
import { selectPhotos, usePhotoSeqContext } from '../../context';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Animated as RNAnimated,
} from 'react-native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Button } from '@tamagui/button';
import { Activity, CircleX, Play, PlayCircle, Plus, PlusCircle, Share } from '@tamagui/lucide-icons';
import * as ImagePicker from 'react-native-image-picker';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
    withSpring,
    useAnimatedReaction,
} from 'react-native-reanimated';
import { useEffect, useMemo, useRef, useState } from 'react';
import usePhotoAnimation from '../../hooks/usePhotoAnimation';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';

import { XStack, YStack, ZStack } from '@tamagui/stacks';
import { exportToMP4 } from './export-to-mp4';
const FRAME_RATE = 30; // 30 FPS

const PhotoSequence = () => {
    const { photos, dispatch } = usePhotoSeqContext();
    const { height, width } = Dimensions.get('window');
    const [activePhotoIndex, setActivePhotoIndex] = useState<number>(-1);
    const viewRef = useRef(null);
    const frameCounter = useRef(0);
    const frameImages = useRef([]);
    const [animations, setAnimations] = useState(
        photos.map(() => new RNAnimated.Value(0))
    );
    const sharedValue = useSharedValue<number>(0.5); // Use shared value
    const rotateValue = useSharedValue('0deg');

    const viewShotRef = useRef(null);
    const [isMovieExportable, setIsMovieExportable] = useState(false);

    const TOTAL_FRAMES = photos.length * 160;

    console.log(animations);

    useEffect(() => {
        // handlePhotoTimer()
    }, [photos]);

    const handleSelectPhotos = async () => {
        try {
            const result = await ImagePicker.launchImageLibrary({
                quality: 0.5,
                mediaType: 'photo',
                selectionLimit: 12,
            });
            console.log(result.assets);
            dispatch(selectPhotos(result.assets || []));
            setActivePhotoIndex(0);
            sharedValue.value = 0.3;
        } catch (e) {
            console.log(e);
        }
    };
    const resetAnimation = () => {
        sharedValue.value = 0;
        rotateValue.value = '0deg';
        setActivePhotoIndex(-1);
        dispatch(selectPhotos([]));
    };
    const handlePress = async (index: number) => {
        // resetAnimation()
        const timingAnimationTypes: any = [1, Math.PI * 2];
        const commonSharedVals = [sharedValue, rotateValue];
        const getAnimation = (index: number) => {
            switch (index) {
                case 0:
                case 1:
                    return (commonSharedVals[index].value = withTiming(
                        timingAnimationTypes[index],
                        { duration: 5000 },
                        finishedCallBack
                    ));
                case 2:
                    return (sharedValue.value = withSpring(
                        1.5,
                        { duration: 5000 },
                        finishedCallBack
                    ));
            }
        };
        getAnimation(index % 3);
        // await startAnimationAndCaptureFrames()
    };

    const finishedCallBack = (isFinished: boolean | undefined) => {
        if (isFinished) {
            const nextIndex = (activePhotoIndex + 1) % photos.length;
            // runOnJS(handlePress)
            runOnJS(setActivePhotoIndex)(nextIndex);
            console.log('completed', activePhotoIndex);
            // sharedValue.value = 1;
        }
    };

    useEffect(() => {
        handlePress(activePhotoIndex);
        if (activePhotoIndex >= 0 && frameImages.current.length === 0) {
            startAnimationAndCaptureFrames();
        }
        // startAnimationAndCaptureFrames()
    }, [activePhotoIndex]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: sharedValue.value,
            transform: [{ scale: sharedValue.value }, { rotate: rotateValue.value }],
        };
    });

    console.log({ photos, activePhotoIndex, animatedStyle });

    const startAnimationAndCaptureFrames = async () => {
        // Capture frames as the animation progresses
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            setTimeout(
                async () => {
                    try {
                        const uri = await captureRef(viewShotRef, {
                            format: 'png',
                            quality: 1,
                        });

                        frameImages.current.push(uri);
                        console.log(`Captured frame ${i + 1} of ${TOTAL_FRAMES}: ${uri}`);

                        if (i === TOTAL_FRAMES - 1) {
                            console.log('All frames captured.', frameImages.current);
                            // Once all frames are captured, export them to an MP4 file
                            setIsMovieExportable(true);
                            return;
                        }
                    } catch (error) {
                        console.error('Error capturing frame:', error);
                    }
                },
                (i * 1000) / FRAME_RATE
            ); // delay for each frame (1s / 30fps = 33ms per frame)
        }
    };

    const handleExportVideo = async () => {
        try {
            console.log({TOTAL_FRAMES,FRAME_RATE})
            await exportToMP4(frameImages.current, TOTAL_FRAMES / FRAME_RATE);
        } catch (e) {
            console.error('Handle Export File Error : ', e);
        }
    };

    return (
        <View
            flex={1}
            paddingTop="$8"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            height={height}
            width={width}
            style={{ boxSizing: "border-box" }}

        >
            <SizableText size="$9" alignContent="flex-start">
                Photo Sequence
            </SizableText>
            <View
                width={width}
                // gap="$0"
                flexDirection="row"
                // justifyContent="flex-start"
                alignItems="center"
                paddingLeft="$0"
            >
                <Button
                    flex={10}
                    onPress={handleSelectPhotos}
                    padding="$2"
                    size="$3"
                    icon={PlusCircle}
                >
                    Select Photos
                </Button>
                <Button
                    flex={5}
                    onPress={() => {
                        handlePress(0);
                        startAnimationAndCaptureFrames();
                    }}
                    margin="$6"
                    padding="$2"
                    size="$3"
                    icon={PlayCircle}
                >
                    Play
                </Button>
                <Button
                    onPress={resetAnimation}
                    margin="$6"
                    padding="$2"
                    size="$3"
                    icon={CircleX}
                >
                    Reset
                </Button>
            </View>
            <View
                style={{ maxHeight: 350 }}
            // horizontal={true}
            // showsHorizontalScrollIndicator={true}
            >
                {activePhotoIndex >= 0 && photos.length && photos[activePhotoIndex] ? (
                    <XStack
                        flex={1}
                        borderWidth={2}
                        borderColor="$color"
                        borderRadius="$4"
                        gap="$2"
                        padding="$2"
                        width={width - 30}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <ViewShot
                            ref={viewShotRef}
                            options={{ format: 'jpg', quality: 0.9 }}
                        >
                            <Animated.View ref={viewRef} style={{ width: width - 50 }}>
                                <Animated.Image
                                    // onLoad={startAnimationAndCaptureFrames}
                                    height={250}
                                    width={width}
                                    source={{
                                        uri: photos[activePhotoIndex].uri,
                                    }}
                                    style={[animatedStyle]}
                                />
                            </Animated.View>
                        </ViewShot>
                    </XStack>
                ) : (
                    <SizableText
                        textAlign="center"
                        width={width}
                        height={height}
                        justifyContent="center"
                    >
                        Please Upload Images
                    </SizableText>
                )}
            </View>
            <SizableText textAlign="center" width={width}>
                {activePhotoIndex + 1} {'/'} {photos.length}
            </SizableText>
            <Button
                backgroundColor={isMovieExportable ? '#000' : 'gray'}
                color={'#fff'}
                iconAfter={Share}
                disabled={!isMovieExportable || activePhotoIndex < 0}
                width={width - 80}
                onPress={handleExportVideo}
                margin="$6"
                padding="$2"
                size="$4"
                borderRadius={"$1"}
            >
                Export Video
            </Button>
        </View>
    );
};

export default PhotoSequence;
