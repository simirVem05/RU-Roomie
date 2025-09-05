import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function basicInfo() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
            contentContainerClassName="flex-1"
            keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-3 mb-10">
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};