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

export default function PreferencesScreen() {
  const [prefs, setPrefs] = useState({
    sleepSchedule: '',
    cleanlinessType: '',
    noiseToleration: '',
    socialType: '',
    timeAtHome: '',
    desiredCommunication: '',
    housingType: '',
    roomType: '',
    hasPet: '',
    smokes: '',
    drinks: '',
    guestFrequency: '',
  });

  const sleepSchedules = [
    { label: "Early Bird", value: 'Early Bird' },
    { label: "Night Owl", value: 'Night Owl' },
    { label: "Flexible", value: 'Flexible' },
  ];

  const cleanlinessTypes = [
    { label: "Messy Slob", value: 'Messy Slob' },
    { label: "Disorganized", value: 'Disorganized' },
    { label: "Organized", value: 'Organized' },
    { label: "Neat Freak", value: 'Neat Freak' },
  ];

  const noiseTolerations = [
    { label: "Very Little Noise", value: 'Very Little Noise' },
    { label: "Moderate Noise", value: 'Moderate Noise' },
    { label: "Heavy Noise", value: 'Heavy Noise' },
    { label: "Any Noise", value: 'Any Noise' },
  ];

  const onSave = () => {
    
    router.replace('/');
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
              Next, your lifestyle.
            </Text>
          </View>

          <View className="px-5 space-y-4">
            <DropdownField
              label="Sleep Schedule"
              placeholder="Select..."
              value={prefs.sleepSchedule}
              options={sleepSchedules}
              onValueChange={(s) => setPrefs({ ...prefs, sleepSchedule: s})}
            />

            <DropdownField
              label="Cleanliness"
              placeholder="Select..."
              value={prefs.cleanlinessType}
              options={cleanlinessTypes}
              onValueChange={(c) => setPrefs({ ...prefs, cleanlinessType: c})}
            />

            <DropdownField
              label="Noise Toleration"
              placeholder="Select..."
              value={prefs.noiseToleration}
              options={cleanlinessTypes}
              onValueChange={(c) => setPrefs({ ...prefs, cleanlinessType: c})}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
