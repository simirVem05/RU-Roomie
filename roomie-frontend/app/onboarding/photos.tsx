import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, Text, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownField from "@/components/Dropdown";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function Photos() {
  const { user } = useUser();
  const [photos, setPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const pickPhotos = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!perm.granted) {
      Alert.alert("Permission required", "Please allow photo library access to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: Math.max(0, 6 - photos.length),
    });

    if (result.canceled) return;

    const newUris = result.assets.map((a) => a.uri);

    setPhotos((prev) => {
      const merged = [...prev, ...newUris];
      const deduped = Array.from(new Set(merged));
      return deduped.slice(0, 6);
    });
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const onSave = async () => {
    try{
      if(!API_BASE) {
        Alert.alert("Config Error", "EXPO_PUBLIC_API_URL is nto set");
        return;
      }
      if(!user?.id){
        Alert.alert("Auth Error", "No Clerk user found");
        return;
      }
      if (photos.length < 3){
        Alert.alert("Add more photos", "Please upload at least 3 photos.");
        return;
      }
      if (photos.length > 6){
        Alert.alert("Too many photos", "You can upload up to 6 photos.");
        return;
      }
      if(saving) return;

      setSaving(true);

      await axios.post(`${API_BASE}/api/v1/profile`, {
        clerkUserId: user.id,
        photos,
        onboardingStep: "bio",
      });

      router.replace("/onboarding/bio");
    } catch(err: any){
      console.error(err?.response?.data || err.message);
      Alert.alert("Error", "Could not save your photos. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-5 pt-10 pb-24">
        <Text className="text-primaryRed font-semibold text-4xl mb-3">
          Say cheese! Add your photos below.
        </Text>

        <Text className="text-md font-semibold mt-4">
          Upload at least 3 photos. You can upload up to 6.
        </Text>

        <View className="flex-row flex-wrap justify-between mt-10">
          {photos.map((uri) => (
            <Pressable
              key={uri}
              onPress={() => removePhoto(uri)}
              className="w-[48%] aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100"
            >
              <Image source={{ uri }} className="w-full h-full"/>
              <View className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full">
                <Text className="text-white text-xs">Remove</Text>
              </View>
            </Pressable>
          ))}

          {photos.length < 6 && (
            <Pressable
              onPress={pickPhotos}
              className="w-[48%] aspect-square mb-4 rounded-2xl bg-gray-100 items-center justify-center"
            >
              <Text className="text-3xl text-gray-500">+</Text>
              <Text className="text-gray-500 mt-2">Add Photo</Text>
            </Pressable>
          )}
        </View>

        <CustomButton
          title={saving ? "Saving..." : "Continue"}
          onPress={onSave}
          className="mt-6 py-2"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
