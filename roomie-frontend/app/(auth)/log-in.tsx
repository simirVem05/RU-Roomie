import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity
} from 'react-native';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Link, router, useRouter } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignIn } from '@clerk/clerk-expo';

const LogIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onLogInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView contentContainerClassName="bg-white flex-1 justify-center">
          <View className="items-center mb-8">
            <Image source = {images.rutgers} className="w-25 h-20"
            resizeMode="contain"
            />
          </View>

          <View className="px-5 space-y-4">
            <InputField
            label="Email"
            placeholder='you@example.com'
            placeholderTextColor={"#a6a5a0ff"}
            icon={icons.email}
            value={form.email}
            onChangeText={v => setForm({ ...form, email: v })}
            />

            <InputField
              label="Password"
              placeholder="••••••••••"
              placeholderTextColor={"#a6a5a0ff"}
              icon={icons.password}
              secureTextEntry
              value={form.password}
              onChangeText={v => setForm({ ...form, password: v })}
            />

            <CustomButton title="Log In" onPress={onLogInPress} className="mt-6 py-2" />

            <OAuth/>

            <Link href="/sign-up" className="text-md text-center mt-5">
              <Text>Don't have an account? </Text>
              <Text className="text-primaryRed">Create an Account</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogIn;
