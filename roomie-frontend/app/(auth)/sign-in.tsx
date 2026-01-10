import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from 'expo-router';
import CustomButton from "@/components/CustomButton";

const SignIn = () => {
    const handleLogIn = () => {
        router.replace('/log-in');
    };

    const handleSignUp = () => {
        router.replace('/sign-up');
    };
    
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName='flex-1 h-full'>
                <View className="items-center justify-center flex-1 mt-10">
                    <Text className='text-primaryRed text-center text-7xl font-semibold'>RU Roomie</Text>
                    <Text className="text-center text-primaryRed text-xl mt-2">
                        R U looking for a roomie?
                    </Text>
                </View>

                <View className="items-center justify-end flex-1 px-5 mb-10">
                        <CustomButton title="Log In" onPress={handleLogIn} className="py-4 mt-10"/>

                        <CustomButton title="Sign Up" onPress={handleSignUp} className="py-4 mt-4"/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn;