// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home';
import { createTamagui, TamaguiProvider, View } from '@tamagui/core';
import { config } from '@tamagui/config/v3';

//@ts-ignore
const uiConfig = createTamagui(config);

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TamaguiProvider config={uiConfig}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </TamaguiProvider>
  );
}
