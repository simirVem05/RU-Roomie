import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    Image,
    Modal,
    Pressable,
    ScrollView,
} from "react-native";
import { DropdownFieldProps } from "@/types/type";

export default function DropdownField({
    label,
    value = "",
    placeholder = "Select...",
    options,
    onValueChange,
    icon,
    labelStyle,
    containerStyle,
    inputStyle,
    iconStyle,
    selectedValues = [],
}: DropdownFieldProps) {
    const [open, setOpen] = useState(false);

    const selectedLabel = useMemo(() => {
        const match = options.find((o) => o.value === value);
        return match?.label ?? "";
    }, [options, value]);

    return (
        <View className="my-2 w-full">
            <Text className={`text-lg mb-3 font-semibold ${labelStyle || ""}`}>
                {label}
            </Text>

            <Pressable
            onPress={() => setOpen(true)}
            className={`flex flex-row justify-start items-center relative rounded-full bg-gray-100 ${containerStyle || ""}`}
            >
                {icon && (
                    <Image source={icon}
                    className={`w-6 h-6 ml-4 ${iconStyle || ""}`}
                    />
                )}

                <Text
                    className={`rounded-full p-4 text-[15px] flex-1 
                    ${value ? "text-black" : "text-gray-400"}
                    ${inputStyle || ""}`}
                >
                    {value ? selectedLabel : placeholder}
                </Text>

                <Text className="mr-5 text-gray-400 text-xl">▾</Text>
            </Pressable>

            <Modal transparent animationType="fade" visible={open}
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                    onPress={() => setOpen(false)}
                >
                    <Pressable
                        className="w-full max-w-[500px] bg-white rounded-2xl overflow-hidden"
                        onPress={() => {}}
                    >
                        <View className="px-5 py-4 border-b border-gray-100">
                            <Text className="text-lg font-semibold">{label}</Text>
                        </View>

                        <ScrollView className="max-h-[340px]">
                            {options.map((opt) => {
                                const isSelected = selectedValues.includes(opt.value);

                                return (
                                    <Pressable
                                        key={opt.value}
                                        onPress={() => {
                                            onValueChange(opt.value);
                                            setOpen(false);
                                        }}
                                        className={`px-5 py-4 border-b border-gray-100 ${
                                            opt.value === value ? "bg-gray-50" : "bg-white"
                                        }`}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-base">
                                                {opt.label}
                                            </Text>

                                            {isSelected ? (
                                                <Text className="text-lg font-semibold">
                                                    ✓
                                                </Text>
                                            ) : null}
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </ScrollView>

                        <Pressable
                            onPress={() => setOpen(false)}
                            className="px-5 py-4"
                        >
                            <Text className="text-center text-primaryRed font-semibold">
                                Cancel
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}