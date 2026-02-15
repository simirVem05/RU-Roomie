import {View, Text, Image} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";

import icons from '@/constants/icons'

const TabIcon = ({ focused, icon, title}: {
    focused: boolean;
    icon: any;
    title: string;
}) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image source={icon} tintColor={focused ? '#cf1405' : '#000000ff'}
        resizeMode="contain" className="size-6" />
    </View>
)

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                minHeight: 100,
                backgroundColor: '#ffffffff',
                // borderTopColor: 'black',
                // borderTopWidth: 0.2,
            }
        }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.home} 
                        focused={focused} title="Home"/>
                    )
                }}
            />

            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.chat} 
                        focused={focused} title="Chat"/>
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.person} 
                        focused={focused} title="Profile"/>
                    )
                }}
            />

        </Tabs>
    )
}

export default TabsLayout;