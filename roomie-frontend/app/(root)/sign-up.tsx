import React, { useState } from 'react';
import { View, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import icons from '@/constants/icons';
import axios from 'axios';

// 👇 Import your preferences screen
// Adjust this path to wherever your PreferencesScreen lives:
// e.g. if you used Expo Router: import PreferencesScreen from '../preferences';
import PreferencesScreen from './preferences';

export default function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // 👇 Preview flag
  const [previewPrefs, setPreviewPrefs] = useState(false);

  const onSignUpPress = async () => {
    if (form.password !== form.confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    try {
      await axios.post('https://your-api.com/api/auth/register', {
        name: form.fullName,
        email: form.email,
        password: form.password,
      });
      Alert.alert('Success', 'Account created!');

      // Normally you'd route here:
      // router.push('/preferences');
      // navigation.navigate('Preferences');

      // For now we just flip the preview flag:
      setPreviewPrefs(true);
    } catch {
      Alert.alert('Error', 'Unable to sign up.');
    }
  };

  // 👇 If previewPrefs is true, render PreferencesScreen instead
  if (previewPrefs) {
    return <PreferencesScreen />;
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="bg-white flex-1 justify-center">
        <View className="items-center mb-8">
          <Image source={images.rutgers} className="w-24 h-24" />
        </View>

        <View className="px-5 space-y-4">
          <InputField
            label="Full Name"
            placeholder="John Doe"
            icon={icons.person}
            value={form.fullName}
            onChangeText={v => setForm({ ...form, fullName: v })}
          />

          <InputField
            label="Email"
            placeholder="you@example.com"
            icon={icons.email}
            value={form.email}
            onChangeText={v => setForm({ ...form, email: v })}
          />

          <InputField
            label="Password"
            placeholder="••••••"
            icon={icons.password}
            secureTextEntry
            value={form.password}
            onChangeText={v => setForm({ ...form, password: v })}
          />

          <InputField
            label="Confirm Password"
            placeholder="••••••"
            icon={icons.password}
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={v => setForm({ ...form, confirmPassword: v })}
          />

          <CustomButton title="Sign Up" onPress={onSignUpPress} />
          <CustomButton
            title="Preview Preferences"
            onPress={() => setPreviewPrefs(true)}
            className="mt-2 bg-gray-200"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
