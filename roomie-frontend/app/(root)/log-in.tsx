import {View, Text, ScrollView, Image} from 'react-native'
import React, {useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import images from "@/constants/images";
import icons from "@/constants/icons";
import CustomButton from '@/components/CustomButton';

const LogIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const onLogInPress = async () => {
        
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName='bg-white flex-1 my-10'>
                <View className="bg-white flex-1 items-center">
                    <Image source={images.rutgers} className='z-0 my-10'/>
                </View>

                <View className='p-5 justify-top flex-1'>
                    <InputField 
                    label="Email"
                    placeHolder="Enter your email"
                    icon={icons.email}
                    value={form.email}

                    onChangeText={(value) => setForm({
                        ...form, email: value,
                    })}
                    />
                    <InputField 
                    label="Password"
                    placeHolder="Enter your password"
                    icon={icons.password}
                    value={form.password}

                    onChangeText={(value) => setForm({
                        ...form, password: value,
                    })}
                    />

                    <CustomButton title="Log In" onPress={onLogInPress} className="mt-6"/>
                </View>
                
            </ScrollView>
        </SafeAreaView>
        
    )
}

export default LogIn;