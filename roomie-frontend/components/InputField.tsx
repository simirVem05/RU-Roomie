import { KeyboardAvoidingView, TouchableWithoutFeedback, View, Text, Image, TextInput, Platform, Keyboard } from "react-native";
import { InputFieldProps } from "@/types/type";

const InputField = ({
    label,
    labelStyle,
    icon,
    secureTextEntry = false,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    ... props
}: InputFieldProps) => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='my-2 w-full'>
                <Text className={`text-lg mb-3 ${labelStyle}`}>
                    {label}
                </Text>

                <View 
                className={`flex flex-row justify-start items-center relative rounded-full border focus:border-white ${containerStyle}`}>
                    {icon && (<Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`}/>)}
                    <TextInput 
                    className={`rounded-full p-4 text-[15px] flex-1 ${inputStyle} text-left`}
                    secureTextEntry={secureTextEntry}
                    {... props}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
)

export default InputField;