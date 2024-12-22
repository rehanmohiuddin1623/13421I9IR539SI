import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const usePhotoAnimation = (maxPhotosLength: number) => {
  const animatedValues = new Array(maxPhotosLength).map(() =>
    useSharedValue(0)
  );

  useEffect(() => {
    // Step 2: Trigger different animations for each image
    animatedValues.forEach((animatedValue, index) => {
      animatedValue.value = withDelay(
        index * 300,
        withTiming(1, { duration: 500 })
      );
    });
  }, []);

  const animatedValue = useSharedValue([
    { opacity: 0.3 },
    { transform: [{ rotateX: '45deg' }] },
  ]); // shared value for opacity
  //Math.floor(Math.random() * 10) + 1;

  const getAnimation = (index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      // Call the hook once and dynamically set the animation logic
      let transform = [];
      let opacity = animatedValues[index].value;

      if (index === 0) {
        // Slide from Left
        transform.push({
          translateX: (1 - animatedValues[index].value) * -100,
        });
      } else if (index === 1) {
        // Scale Up
        transform.push({ scale: animatedValues[index].value });
      } else if (index === 2) {
        // Rotate
        transform.push({ rotate: `${animatedValues[index].value * 360}deg` });
      } else if (index === 3) {
        // Fade In (only changes opacity, no transform)
      } else if (index === 4) {
        // Slide from Bottom
        transform.push({ translateY: (1 - animatedValues[index].value) * 100 });
      }

      return {
        opacity,
        transform,
      };
    });
    return animatedStyle;
  };

  return [animatedValue, getAnimation] as const;
};

export default usePhotoAnimation;
