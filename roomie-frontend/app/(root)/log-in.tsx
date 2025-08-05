import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from 'react-native';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import icons from '@/constants/icons';

const LogIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onLogInPress = async () => {
    // your login logic
  };

  return (
    <SafeAreaView className="bg-white h-full">
      {/* ← New: wrap everything that needs to adjust */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        {/* ← New: tap outside to dismiss */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerClassName='bg-white flex-1 my-10' keyboardShouldPersistTaps="handled">
            <View className="bg-white flex-1 items-center">
              <Image source={images.rutgers} className='z-0 my-10'/>
            </View>

            <View className='p-5 justify-top flex-1'>
              <InputField 
                label="Email"
                placeholder="Enter your email"
                icon={icons.email}
                value={form.email}
                onChangeText={value => setForm({...form, email: value})}
              />
              <InputField 
                label="Password"
                placeholder="Enter your password"
                icon={icons.password}
                secureTextEntry
                value={form.password}
                onChangeText={value => setForm({...form, password: value})}
              />

              <CustomButton title="Log In" onPress={onLogInPress} className="mt-6"/>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogIn;
