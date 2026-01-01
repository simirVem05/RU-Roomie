import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function IndexGate() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            router.replace("/sign-in");
            return;
        }

        router.replace("/onboarding/basic-info");
    }, [isLoaded, isSignedIn, user]);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator/>
        </View>
    )
}