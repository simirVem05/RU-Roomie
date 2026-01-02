import InputField from "@/components/InputField";
import icons from "@/constants/icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownField from "@/components/Dropdown";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { Alert } from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function BasicInfo() {
    const [form, setForm] = useState({
        displayName: '',
        age: '',
        year: '',
        gender: '',
    });

    const years = [
        { label: "Freshman", value: "Freshman" },
        { label: "Sophomore", value: "Sophomore" },
        { label: "Junior", value: "Junior" },
        { label: "Senior", value: "Senior" },
        { label: "Grad", value: "Grad" },
    ];

    const genders = [
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
        { label: "Nonbinary", value: "Nonbinary" },
        { label: "Other", value: "Other" },
    ];

    const { user } = useUser();
    const mongoUserId = user?.publicMetadata?.mongoUserId as string | undefined;

    const continuePress = async () => {
        try {
            if (!API_BASE) {
                Alert.alert("Config error", "EXPO_PUBLIC_API_URL is not set");
                return;
            }
            if (!user?.id) {
                Alert.alert("Auth error", "No Clerk user found");
                return;
            }

            if (
                !form.displayName.trim() ||
                !form.age.trim() ||
                !form.year ||
                !form.gender
            ) {
                Alert.alert("Missing info", "Please fill out all fields.");
                return;
            }

            await axios.post(`${API_BASE}/api/v1/profile`, {
                clerkUserId: user.id,
                displayName: form.displayName.trim(),
                age: Number(form.age),
                year: form.year,
                gender: form.gender,
                onboardingStep: "preferences",
            });

            router.push("/onboarding/preferences");
        } catch (err: any) {
            console.error(err?.response?.data || err.message);
            Alert.alert("Error", "Could not save your info. Try again.")
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
            >
                <ScrollView contentContainerClassName="bg-white flex-grow mt-10">
                    <View className="h-[10%]"/>
                    
                    <View className="px-5 mb-10">
                        <Text className="text-primaryRed font-semibold text-4xl">
                            First, the basics.
                        </Text>
                    </View>
                    
                    <View className="px-5 space-y-4">
                        <InputField
                        label="Your Name (This will be displayed on your profile)"
                        placeholder="e.g. Sam"
                        placeholderTextColor={"#a6a5a0ff"}
                        value={form.displayName}
                        onChangeText={v => setForm({...form, displayName: v})}
                        />

                        <InputField
                        label="Your Age"
                        placeholder="e.g. 20"
                        placeholderTextColor={"#a6a5a0ff"}
                        value={form.age}
                        onChangeText={v => setForm({...form, age: v})}
                        keyboardType="number-pad"
                        />

                        <DropdownField
                        label = "Your Year"
                        placeholder="Select..."
                        value={form.year}
                        options={years}
                        onValueChange={(y) => setForm({ ...form, year: y})}
                        />

                        <DropdownField
                        label = "Your Gender"
                        placeholder="Select..."
                        value={form.gender}
                        options={genders}
                        onValueChange={(g) => setForm({ ...form, gender: g})}
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