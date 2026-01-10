import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownField from "@/components/Dropdown";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const MAX_CHARS = 500;

export default function Bio() {
  const [bio, setBio] = useState("");
  const [saving, setSave] = useState(false);
  const { user } = useUser();

  const finish = async () => {
    if(saving) return;
    
    try{
      if(!API_BASE){
        Alert.alert("Config Error", "EXPO_PUBLIC_API_URL is not set")
        return;
      }
      if(!user?.id){
        Alert.alert("Auth Error", "Clerk user was not found");
        return;
      }

      if(!bio.trim()){
        Alert.alert("Bio Missing", "Please enter your bio.");
        return;
      }

      setSave(true);

      await axios.post(`${API_BASE}/api/v1/profile`, {
        clerkUserId: user.id,
        bio,
        onboardingStep: "complete",
        isOnboarded: true,
      });

      router.replace("/(app)/(tabs)");
    } catch(err: any){
      console.error(err?.response?.data || err.message);
      Alert.alert("Error", "Could not save bio.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView contentContainerClassName="flex-grow mt-10 pb-20">
          <View className="h-[2%]"/>

          <View className="px-5 mb-8">
            <Text className="text-primaryRed font-semibold text-4xl">
              Finally, tell us something about you.
            </Text>

            <Text className="text-md font-semibold mt-5">
              Enter your bio below.
            </Text>
          </View>
          

          <View className="px-5">
            <View className="bg-gray-100 rounded-2xl min-h-[160px] mt-10 px-3">
              <TextInput
                multiline
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself..."
                placeholderTextColor="#9ca3af"
                textAlignVertical="top"
                maxLength={MAX_CHARS}
              />
            </View>

            <Text className="text-right text-gray-400 mt-2">
              {bio.length} / {MAX_CHARS}
            </Text>

            <CustomButton
              title="Finish"
              onPress={finish}
              className="mt-10 py-2"
            />
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
