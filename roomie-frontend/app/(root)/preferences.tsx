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

export default function PreferencesScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    housingType: '',
    okWithPets: '',
    bedtime: '',
  });

  const onSave = () => {
    // TODO: POST prefs to your backend…
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',    // ← vertical centering
          padding: 16
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, marginBottom: 24 }}>
          Your Roommate Preferences
        </Text>

        <InputField
          label="Housing Type"
          placeholder="Dorm, Apartment, House"
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
          label="Bedtime"
          placeholder="e.g. 11pm"
          icon={icons.clock}
          value={prefs.bedtime}
          onChangeText={v => setPrefs(s => ({ ...s, bedtime: v }))}
        />

        <View style={{ marginTop: 24 }}>
          <Button title="Save Preferences" onPress={onSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
