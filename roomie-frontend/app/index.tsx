import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function IndexGate() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const run = async () => {
            if (!isLoaded) return;

            if (!isSignedIn) {
                router.replace("/sign-in");
                setChecking(false);
                return;
            }

            if (!user?.id){
                return;
            }

            if(!API_BASE) {
                console.warn("EXPO_PUBLIC_API_URL is not set");
                router.replace("/onboarding/basic-info");
                setChecking(false);
                return;
            }

            try {
                const res = await axios.get(`${API_BASE}/api/v1/profile/by-clerk/${user.id}`);

                const profile = res.data?.data?.profile;

                if(!profile){
                    router.replace("/onboarding/basic-info");
                    return;
                }

                if(!profile.isOnboarded){
                    switch (profile.onboardingStep) {
                        case "basic-info":
                            router.replace("/onboarding/basic-info");
                            return;
                        case "preferences":
                            router.replace("/onboarding/preferences");
                            return;
                        case "interests":
                            router.replace("/onboarding/interests");
                            return;
                        case "photos":
                            router.replace("/onboarding/photos");
                            return;
                        case "bio":
                            router.replace("/onboarding/bio");
                            return;
                        default:
                            router.replace("/onboarding/basic-info");
                            return;
                    }
                    return;
                }

                router.replace("/(app)/(tabs)");
                return;
            } catch (err) {
                console.error("IndexGate failed to fetch profile: ", err);
                router.replace("/onboarding/basic-info");
            } finally {
                setChecking(false);
            }
        };

        run();
    }, [isLoaded, isSignedIn, user?.id]);

    if (checking) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator />
            </View>
        );
    }

    return null;
}