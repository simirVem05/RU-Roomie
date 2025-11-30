import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button
} from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '@/components/InputField';
import icons from '@/constants/icons';
import CustomButton from '@/components/CustomButton';
import SafeAreaContext from 'react-native-safe-area-context';

export default function PreferencesScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    housingType: '',
    roomType: '',
    okWithPets: '',
    bedtime: '',
  });

  const onSave = () => {
    // TODO: POST prefs to your backend…
    router.replace('/');
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView
        contentContainerClassName='flex-1'
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-3 mb-10">
          <Text className="text-4xl text-primaryRed font-semibold">
          Your Preferences
          </Text>

          <InputField
          label="Housing Type"
          placeholder="Dorm, Apartment, House"
          icon={icons.home}
          value={prefs.housingType}
          onChangeText={v => setPrefs(s => ({ ...s, housingType: v }))}
          />

          <InputField
          label="Room Type"
          placeholder="Single, Double"
          icon={icons.home}
          value={prefs.housingType}
          onChangeText={v => setPrefs(s => ({ ...s, housingType: v }))}
          />

          <InputField
            label="OK with Pets?"
            placeholder="Yes / No"
            icon={icons.pets}
            value={prefs.okWithPets}
            onChangeText={v => setPrefs(s => ({ ...s, okWithPets: v }))}
          />

          <InputField
            label="Sleep Schedule"
            placeholder="Night Owl, Early Bird, Flexible"
            icon={icons.clock}
            value={prefs.bedtime}
            onChangeText={v => setPrefs(s => ({ ...s, bedtime: v }))}
          />

          <CustomButton title="Save Preferences" onPress={onSave} className="mt-10 p-4"/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
