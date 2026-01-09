import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownField from "@/components/Dropdown";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function PreferencesScreen() {
  const [prefs, setPrefs] = useState({
    sleepSchedule: '',
    cleanlinessType: '',
    noiseToleration: '',
    socialType: '',
    timeAtHome: '',
    desiredCommunication: '',
    desiredHousingType: '',
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

  const socialTypes = [
    { label: "Introvert", value: 'Introvert' },
    { label: "Lean Introverted", value: 'Lean Introverted' },
    { label: "Lean Extroverted", value: 'Lean Extroverted' },
    { label: "Extrovert", value: 'Extrovert' },
  ];

  const homeTimes = [
    { label: "Always Home", value: 'Always Home' },
    { label: "Usually Home", value: 'Usually Home' },
    { label: "Mixed", value: 'Mixed' },
    { label: "Usually Not At Home", value: 'Usually Not At Home' },
    { label: "Never Home", value: 'Never Home' },
  ];

  const communicationLevels = [
    { label: "Only When Necessary", value: 'Only When Necessary' },
    { label: "We Can Be Cool", value: 'We Can Be Cool' },
    { label: "Let's Be Friends", value: "Let's Be Friends" },
    { label: "Let's Be Best Friends", value: "Let's Be Best Friends" },
  ];

  const housingTypes = [
    { label: "Dorm", value: 'Dorm' },
    { label: "Apartment", value: 'Apartment' },
    { label: "House", value: "House" },
  ];

  const roomTypes = [
    { label: "Single", value: 'Single' },
    { label: "Double", value: 'Double' },
  ];

  const petAnswers = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  const smokeAnswers = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  const drinkAnswers = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  const guestAnswers = [
    { label: "Never", value: 'Never' },
    { label: "Rarely", value: 'Rarely' },
    { label: "Sometimes", value: 'Sometimes' },
    { label: "Often", value: 'Often' },
  ];

  const { user } = useUser();

  const toBoolean = (value: string) => value === "true";

  const [saving, setSave] = useState(false);

  const onSave = async () => {
    if (saving){
        return;
      }
    
    try {
      if (!API_BASE){
        Alert.alert("Config Error", "EXPO_PUBLIC_API_URL is not set");
        return;
      }
      if(!user?.id) {
        Alert.alert("Auth Error", "No Clerk User Found");
        return;
      }

      if(
        !prefs.sleepSchedule ||
        !prefs.cleanlinessType ||
        !prefs.noiseToleration ||
        !prefs.socialType ||
        !prefs.timeAtHome ||
        !prefs.desiredCommunication ||
        !prefs.desiredHousingType ||
        !prefs.roomType ||
        !prefs.hasPet ||
        !prefs.smokes ||
        !prefs.drinks ||
        !prefs.guestFrequency
      ){
        Alert.alert("Missing Info", "Please Fill Out All Fields");
        return;
      }

      setSave(true);

      await axios.post(`${API_BASE}/api/v1/profile`, {
        clerkUserId: user.id,
        sleepSchedule: prefs.sleepSchedule,
        cleanlinessType: prefs.cleanlinessType,
        noiseToleration: prefs.noiseToleration,
        socialType: prefs.socialType,
        timeAtHome: prefs.timeAtHome,
        desiredCommunication: prefs.desiredCommunication,
        desiredHousingType: prefs.desiredHousingType,
        roomType: prefs.roomType,
        hasPet: toBoolean(prefs.hasPet),
        smokes: toBoolean(prefs.smokes),
        drinks: toBoolean(prefs.drinks),
        guestFrequency: prefs.guestFrequency,
        onboardingStep: "interests",
      });

      router.replace("/onboarding/interests");
    } catch(err: any){
        console.error(err?.response?.data || err.message);
        Alert.alert("Error", "Could not save your info. Try again.")
    } finally {
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
              options={noiseTolerations}
              onValueChange={(t) => setPrefs({ ...prefs, noiseToleration: t})}
            />

            <DropdownField
              label="Personality Type"
              placeholder="Select..."
              value={prefs.socialType}
              options={socialTypes}
              onValueChange={(s) => setPrefs({ ...prefs, socialType: s})}
            />

            <DropdownField
              label="Time Spent At Home"
              placeholder="Select..."
              value={prefs.timeAtHome}
              options={homeTimes}
              onValueChange={(h) => setPrefs({ ...prefs, timeAtHome: h})}
            />

            <DropdownField
              label="Desired Level of Communication"
              placeholder="Select..."
              value={prefs.desiredCommunication}
              options={communicationLevels}
              onValueChange={(c) => setPrefs({ ...prefs, desiredCommunication: c})}
            />

            <DropdownField
              label="Desired Housing Type"
              placeholder="Select..."
              value={prefs.desiredHousingType}
              options={housingTypes}
              onValueChange={(t) => setPrefs({ ...prefs, desiredHousingType: t})}
            />

            <DropdownField
              label="Desired Room Type"
              placeholder="Select..."
              value={prefs.roomType}
              options={roomTypes}
              onValueChange={(r) => setPrefs({ ...prefs, roomType: r})}
            />

            <DropdownField
              label="Do you have a pet?"
              placeholder="Select..."
              value={prefs.hasPet}
              options={petAnswers}
              onValueChange={(p) => setPrefs({ ...prefs, hasPet: p})}
            />

            <DropdownField
              label="Do you smoke?"
              placeholder="Select..."
              value={prefs.smokes}
              options={smokeAnswers}
              onValueChange={(s) => setPrefs({ ...prefs, smokes: s})}
            />

            <DropdownField
              label="Do you drink?"
              placeholder="Select..."
              value={prefs.drinks}
              options={drinkAnswers}
              onValueChange={(d) => setPrefs({ ...prefs, drinks: d})}
            />

            <DropdownField
              label="How often will you bring guests over?"
              placeholder="Select..."
              value={prefs.guestFrequency}
              options={guestAnswers}
              onValueChange={(g) => setPrefs({ ...prefs, guestFrequency: g})}
            />

            <CustomButton
              title="Continue"
              onPress={onSave}
              className="mt-10 py-2"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
