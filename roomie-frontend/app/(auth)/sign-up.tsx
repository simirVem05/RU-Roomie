import React, { useState } from 'react';
import { Platform, View, ScrollView, Image, Alert, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import icons from '@/constants/icons';
import axios from 'axios';
import PreferencesScreen from '../onboarding/preferences';
import { Link, router } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignUp } from "@clerk/clerk-expo";
import { Modal } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function SignUp() {
  const {isLoaded, signUp, setActive} = useSignUp();
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        
        state: 'pending',
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.errors[0].longMessage);
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      const clerkUserId = signUpAttempt.createdUserId;

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })

        try {
          if(!API_BASE){
            console.warn('EXPO_PUBLIC_API_URL is not set');
          }
          else{
            await axios.post(`${API_BASE}/api/v1/auth/sign-up`, {
              name: form.fullName,
              email: form.email,
              password: form.password,
              clerkUserId,
            });
          }
        } catch(error: any) {
          console.error(
            'Error creating backend user:',
            error?.response?.data || error.message
          );
        }

        setVerification({ ...verification, state: "success"});
        
        router.replace('/onboarding/basic-info');
      }
      else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerification({ 
          ...verification,
          error: 'Verification failed',
          state: "failed"
        });
      }
    } catch (err: any) {
      setVerification({ 
          ... verification, 
          error: err.errors[0].longMessage,
          state: "failed",
      });
    }
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView contentContainerClassName="bg-white flex-1 justify-center">
          <View className="items-center mb-8">
            <Image source={images.rutgers} className="w-30 h-20" resizeMode='contain'/>
          </View>

          <View className="px-5 space-y-4">
            <InputField
              label="Full Name"
              placeholder="John Doe"
              placeholderTextColor={"#a6a5a0ff"}
              icon={icons.person}
              value={form.fullName}
              onChangeText={v => setForm({ ...form, fullName: v })}
            />

            <InputField
              label="Email"
              placeholder="you@example.com"
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

            <InputField
              label="Confirm Password"
              placeholder="••••••••••"
              placeholderTextColor={"#a6a5a0ff"}
              icon={icons.password}
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={v => setForm({ ...form, confirmPassword: v })}
            />

            <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6 py-2" />

            <OAuth/>

            <Link href="/log-in" className="text-md text-center mt-5">
              <Text>Already have an account? </Text>
              <Text className="text-primaryRed">Log In</Text>
            </Link>

            {/*Email verification modal */}
            <Modal
              transparent
              animationType="fade"
              visible={verification.state === "pending"}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="w-[95%] bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                    <Text className="text-3xl font-bold mb-2">
                      Verification
                    </Text>
                    <Text className="mb-5">
                      We've sent a verification code to {form.email}
                    </Text>

                    <InputField
                    label="Code"
                    icon={icons.password}
                    placeholder='12345'
                    value={verification.code}
                    keyboardType='numeric'
                    onChangeText={(code) => 
                    setVerification({ ...verification, code })
                    }/>

                    {verification.error && (
                      <Text className="text-red-500 text-sm mt-1">
                        {verification.error}
                      </Text>
                    )}

                    <View>
                      <CustomButton title="Verify Email"
                      onPress={onVerifyPress}
                      className="mt-5 py-2"/>
                    </View>
                  </View>
              </View>
            </Modal>
            
            {/*Success modal */}
            {/*
            <Modal
              transparent
              animationType="fade"
              visible={verification.state === "success"}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="w-[90%] bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                    <Image
                      source={images.check}
                      className="w-[110px] h-[110px] mx-auto my-5"
                    />

                    <Text className="text-4xl font-semibold text-center mt-2">
                      Verified
                    </Text>

                    <Text className="text-base text-gray-500 text-center mt-3">
                      You have successfully verified your account
                    </Text>

                    <View>
                      <CustomButton title="Browse Home"
                      onPress={() => {
                        setVerification(prev => ({
                          ...prev,
                          state: 'default',
                          code: '',
                          error: '',
                        }));
                        
                        router.push('/');
                      }}
                      className="mt-5 py-2"/>
                    </View>
                  </View>
              </View>
            </Modal>
            */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}
