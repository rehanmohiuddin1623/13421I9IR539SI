import React, { useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { Tabs, TabsContentProps } from '@tamagui/tabs';
import { SizableText, H5 } from '@tamagui/text';
import { Separator } from '@tamagui/separator';
import PhotoSequence from '../photo-sequence';
import { PhotoContextProvider } from '../../context';
import { NativeModules } from 'react-native';
import { Button } from "@tamagui/button"
import PhotoCanvas from '../photo-canvas';
import { View } from "@tamagui/core"
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';



const TabsContent = (props: TabsContentProps) => {
    const { height } = Dimensions.get('window'); // Get the screen height



    return (
        <Tabs.Content
            backgroundColor="$background"
            key="tab3"
            padding="$2"
            alignItems="center"
            justifyContent="center"
            flex={1}
            borderColor="$background"
            borderRadius="$2"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderWidth="$2"
            flexDirection="row"
            height={300}
            {...props}
        >
            {props.children}
        </Tabs.Content>
    );
};

function Home() {
    const { height } = Dimensions.get('window'); // Get the screen height
    const [activeTab, setActiveTab] = useState('tab1')

    const handleCloseScreen = () => {

    }

    return (
        <GestureHandlerRootView>
            <View>

                <Tabs
                    defaultValue={activeTab}
                    orientation="horizontal"
                    flexDirection="column"
                    width={'unset'}
                    height={height}
                    borderRadius="$4"
                    borderWidth="$0.25"
                    overflow="hidden"
                    borderColor="$borderColor"
                    marginTop={50}
                    value={activeTab}

                >

                    <Tabs.List
                        separator={<Separator vertical />}
                        disablePassBorderRadius="bottom"
                        aria-label="Manage your account"

                    // height={200}
                    >
                        <Tabs.Tab flex={1} value="tab1" onPress={() => setActiveTab('tab1')} >
                            <SizableText fontFamily="$body">Photo Maker</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab flex={1} value="tab2" onPress={() => setActiveTab('tab2')}>
                            <SizableText fontFamily="$body">Photo Canvas</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>
                    <Separator />
                    <TabsContent height={'300px'} value="tab1">
                        <PhotoContextProvider>
                            <PhotoSequence />
                        </PhotoContextProvider>
                    </TabsContent>

                    <TabsContent value="tab2">
                        <PhotoCanvas closeScreen={handleCloseScreen} />
                    </TabsContent>
                </Tabs>
            </View>
        </GestureHandlerRootView>
    );
}

export default Home;
