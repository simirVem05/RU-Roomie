import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownField from "@/components/Dropdown";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function Interests() {
    const [prefs, setPrefs] = useState({
        interestOne: '',
        interestTwo: '',
        interestThree: '',
        interestFour: '',
        interestFive: '',
    });

    const selectedValues = Object.values(prefs).filter(Boolean);
    
    const interests = [
        { label: 'Traveling', value: 'Traveling' },
        { label: 'Working Out', value: 'Working Out' },
        { label: 'Sports', value: 'Sports' },
        { label: 'Movies', value: 'Movies' },
        { label: 'Music', value: 'Music' },
        { label: 'Nightlife', value: 'Nightlife' },
        { label: 'Outdoors Activities', value: 'Outdoors Activities' },
        { label: 'Shopping', value: 'Shopping' },
        { label: 'Running', value: 'Running' },
        { label: 'Yoga', value: 'Yoga' },
        { label: 'Pilates', value: 'Pilates' },
        { label: 'Meditation', value: 'Meditation' },
        { label: 'Anime', value: 'Anime' },
        { label: 'Art', value: 'Art' },
        { label: 'Dancing', value: 'Dancing' },
        { label: 'Photography', value: 'Photography' },
        { label: 'Cooking', value: 'Cooking' },
        { label: 'Baking', value: 'Baking' },
        { label: 'Politics', value: 'Politics' },
        { label: 'Theatre', value: 'Theatre' },
        { label: 'Animals', value: 'Animals' },
        { label: 'Philosophy', value: 'Philosophy' },
        { label: 'Reading', value: 'Reading' },
        { label: 'Video Games', value: 'Video Games' },
        { label: 'Cars', value: 'Cars' },
        { label: 'Gardening', value: 'Gardening' },
    ];

    const [saving, setSave] = useState(false);

    const { user } = useUser();

    const continuePress = async () => {
        if(saving){
            return;
        }

        try {
            if(!API_BASE){
                Alert.alert("Config Error", "EXPO_PUBLIC_API_URL is not set");
                return;
            }
            if(!user?.id){
                Alert.alert("Auth Error", "No Clerk User Found");
                return;
            }
            
            if(
                !prefs.interestOne ||
                !prefs.interestTwo ||
                !prefs.interestThree ||
                !prefs.interestFour ||
                !prefs.interestFive
            ){
                Alert.alert("Missing Info", "Please Fill Out All Fields");
                return;
            }

            setSave(true);

            await axios.post(`${API_BASE}/api/v1/profile`, {
                clerkUserId: user.id,
                interests: [
                    prefs.interestOne, 
                    prefs.interestTwo, 
                    prefs.interestThree,
                    prefs.interestFour,
                    prefs.interestFive,
                ],
                onboardingStep: 'photos',
            });

            router.replace("/onboarding/photos");
        } catch(err: any){
            console.error(err?.response?.data || err.message);
            Alert.alert("Error", "Could not save your info. Try again.");
        } finally{
            setSave(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
            >
                <ScrollView contentContainerClassName="bg-white flex-grow mt-10 pb-20">
                    <View className="h-[2%]"/>

                    <View className="px-5 mb-8">
                        <Text className="text-primaryRed font-semibold text-4xl">
                            Now, your interests.
                        </Text>
                    </View>

                    <View className="px-5 mb-10">
                        <Text className="font-semibold text-lg">
                            Enter five of your interests below.
                        </Text>
                    </View>

                    <View className="px-5 space-y-4">
                        <DropdownField
                            label="First Interest"
                            placeholder="Select..."
                            value={prefs.interestOne}
                            options={interests}
                            selectedValues={selectedValues}
                            onValueChange={(i) => {
                                const otherSelected = selectedValues.filter(x => x !== prefs.interestOne);
                                if (otherSelected.includes(i)) {
                                    Alert.alert("Duplicate interest", "Pick a different interest.");
                                    return;
                                }
                                setPrefs({ ...prefs, interestOne: i})
                            }}
                        />

                        <DropdownField
                            label="Second Interest"
                            placeholder="Select..."
                            value={prefs.interestTwo}
                            options={interests}
                            selectedValues={selectedValues}
                            onValueChange={(i) => {
                                const otherSelected = selectedValues.filter(x => x !== prefs.interestTwo);
                                if (otherSelected.includes(i)) {
                                    Alert.alert("Duplicate interest", "Pick a different interest.");
                                    return;
                                }
                                setPrefs({ ...prefs, interestTwo: i})
                            }}
                        />

                        <DropdownField
                            label="Third Interest"
                            placeholder="Select..."
                            value={prefs.interestThree}
                            options={interests}
                            selectedValues={selectedValues}
                            onValueChange={(i) => {
                                const otherSelected = selectedValues.filter(x => x !== prefs.interestThree);
                                if (otherSelected.includes(i)) {
                                    Alert.alert("Duplicate interest", "Pick a different interest.");
                                    return;
                                }
                                setPrefs({ ...prefs, interestThree: i})
                            }}
                        />

                        <DropdownField
                            label="Fourth Interest"
                            placeholder="Select..."
                            value={prefs.interestFour}
                            options={interests}
                            selectedValues={selectedValues}
                            onValueChange={(i) => {
                                const otherSelected = selectedValues.filter(x => x !== prefs.interestFour);
                                if (otherSelected.includes(i)) {
                                    Alert.alert("Duplicate interest", "Pick a different interest.");
                                    return;
                                }
                                setPrefs({ ...prefs, interestFour: i})
                            }}
                        />

                        <DropdownField
                            label="Fifth Interest"
                            placeholder="Select..."
                            value={prefs.interestFive}
                            options={interests}
                            selectedValues={selectedValues}
                            onValueChange={(i) => {
                                const otherSelected = selectedValues.filter(x => x !== prefs.interestFive);
                                if (otherSelected.includes(i)) {
                                    Alert.alert("Duplicate interest", "Pick a different interest.");
                                    return;
                                }
                                setPrefs({ ...prefs, interestFive: i})
                            }}
                        />

                        <CustomButton
                            title="Continue"
                            onPress={continuePress}
                            className="mt-10 py-2"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
  );
};