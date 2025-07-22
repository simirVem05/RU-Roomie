import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from 'expo-router';

const SignIn = () => {
    const handleLogIn = () => {
        router.replace('/(root)/log-in');
    };

    const handleSignUp = () => {
        router.replace('/(root)/sign-up');
    };
    
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName='flex-1 justify-center items-center h-full'>
                <View className="items-center justify-center">
                    <Text className='text-primaryRed text-center text-6xl'>RU Roomie</Text>
                    <Text className="text-center text-primaryRed text-lg mt-2">
                        R U looking for a roomie?
                    </Text>

                    <TouchableOpacity onPress={handleLogIn} className="bg-primaryRed rounded-full w-full py-3 mt-20 shadow-md shadow-zinc-300">
                        <Text className='px-20 text-white py-2 text-lg'>
                            Log In
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSignUp} className="bg-primaryRed rounded-full w-full py-3 mt-4 shadow-md shadow-zinc-300">
                        <Text className='px-20 text-white py-2 text-lg'>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn;