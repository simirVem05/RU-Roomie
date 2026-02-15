import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router } from "expo-router";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type PopulatedUser = {
  _id?: string;
  name?: string; // full name (User schema)
  email?: string;
};

type Profile = {
  _id: string;

  // ObjectId in DB, may be populated on the backend into { name, email }
  user: string | PopulatedUser;

  displayName: string; // profile display name (Profile schema)
  age: number;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Grad";
  gender: "Female" | "Male" | "Nonbinary" | "Other";
  bio: string;

  sleepSchedule: "Early Bird" | "Night Owl" | "Flexible";
  cleanlinessType: "Messy Slob" | "Disorganized" | "Organized" | "Neat Freak";
  noiseToleration: "Very Little Noise" | "Moderate Noise" | "Heavy Noise" | "Any Noise";
  socialType: "Introvert" | "Lean Introverted" | "Lean Extroverted" | "Extrovert";
  timeAtHome: "Always Home" | "Usually Home" | "Mixed" | "Usually Not At Home" | "Never Home";
  desiredCommunication:
    | "Only When Necessary"
    | "We Can Be Cool"
    | "Let's Be Friends"
    | "Let's Be Best Friends";

  interests: string[];

  desiredHousingType: "Dorm" | "Apartment" | "House";
  roomType: "Single" | "Double";

  hasPet: boolean;
  smokes: boolean;
  drinks: boolean;

  guestFrequency: "Never" | "Rarely" | "Sometimes" | "Often";

  photos: string[];
  isOnboarded: boolean;
  onboardingStep: "basic-info" | "preferences" | "interests" | "photos" | "bio" | "complete";

  createdAt?: string;
  updatedAt?: string;
};

function Chip({ label }: { label: string }) {
  return (
    <View className="px-3 py-2 rounded-full bg-gray-100 border border-gray-200 mr-2 mb-2">
      <Text className="text-xs text-gray-800">{label}</Text>
    </View>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  const display =
    value === null || value === undefined
      ? "—"
      : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value);

  return (
    <View className="flex-row justify-between items-start py-3 border-b border-gray-100">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm text-gray-900 max-w-[60%] text-right">{display}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  // keep Clerk only for auth + sign out
  const { user: clerkUser } = useUser();
  const { signOut, isLoaded: authLoaded } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Photo paging state
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const photoListRef = useRef<FlatList<string>>(null);

  const clerkId = clerkUser?.id;

  const endpoint = useMemo(() => {
    if (!API_BASE || !clerkId) return null;
    return `${API_BASE}/api/v1/profile/by-clerk/${clerkId}`;
  }, [clerkId]);

  const fetchProfile = useCallback(async () => {
    if (!endpoint) return;
    setErrorMsg(null);

    try {
      const res = await axios.get(endpoint);
      const p = res.data?.data?.profile as Profile | undefined;

      if (!p) {
        setProfile(null);
        setErrorMsg("No profile found for this user.");
        return;
      }

      setProfile(p);
      setActivePhotoIndex(0);
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || e?.message || "Failed to load profile.");
      setProfile(null);
    }
  }, [endpoint]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    };
    run();
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

    const handleEdit = () => {
    router.push("/edit/profile-edit");
    };


  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (e) {
      console.warn("Sign out failed:", e);
    }
  };

  const PHOTO_WIDTH = useMemo(() => {
    const screenW = Dimensions.get("window").width;
    return screenW - 48; // matches outer px-6 container (24 + 24)
  }, []);

  const PHOTO_HEIGHT = 340;

  const onPhotoScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / PHOTO_WIDTH);
      setActivePhotoIndex(idx);
    },
    [PHOTO_WIDTH]
  );

  const populatedUser = useMemo<PopulatedUser | null>(() => {
    if (!profile) return null;
    return typeof profile.user === "object" ? (profile.user as PopulatedUser) : null;
  }, [profile]);

  // ✅ Source of truth: MongoDB User schema (profile.user.name, profile.user.email)
  // Clerk is ONLY a fallback so the UI doesn't show blank if population is missing.
  const fullNameToShow = useMemo(() => {
    return populatedUser?.name || clerkUser?.fullName || clerkUser?.firstName || "—";
  }, [populatedUser?.name, clerkUser?.fullName, clerkUser?.firstName]);

  const emailToShow = useMemo(() => {
    return populatedUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || "—";
  }, [populatedUser?.email, clerkUser?.primaryEmailAddress?.emailAddress]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (!API_BASE) {
    return (
      <View className="flex-1 bg-white px-6 pt-16">
        <Text className="text-xl font-semibold text-gray-900">Profile</Text>
        <Text className="mt-3 text-sm text-gray-600">
          EXPO_PUBLIC_API_URL is not set. Add it to your .env and restart Expo.
        </Text>
      </View>
    );
  }

  if (!authLoaded || !clerkId) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
      {/* Header */}
      <View className="px-6 pt-14">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-gray-900">Profile</Text>

          <View className="flex-row">
            <Pressable
              onPress={onRefresh}
              className="px-4 py-2 rounded-full border border-gray-200 mr-2"
            >
              <Text className="text-sm text-gray-900">
                {refreshing ? "Refreshing..." : "Refresh"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleEdit}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: "#cf1405" }}
            >
              <Text className="text-sm text-white">Edit</Text>
            </Pressable>
          </View>
        </View>

        {errorMsg ? (
          <View className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-700">{errorMsg}</Text>
            <Pressable
              onPress={fetchProfile}
              className="mt-3 self-start px-4 py-2 rounded-full border border-red-200"
            >
              <Text className="text-sm text-red-700">Try again</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Hero card */}
      <View className="mt-5 px-6">
        <View className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Photos */}
          {profile?.photos?.length ? (
            <View className="bg-gray-50 items-center">
              <View style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT, overflow: "hidden" }}>
                <FlatList
                  ref={photoListRef}
                  data={profile.photos}
                  keyExtractor={(uri, idx) => `${uri}-${idx}`}
                  horizontal
                  pagingEnabled
                  snapToInterval={PHOTO_WIDTH}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={onPhotoScrollEnd}
                  bounces={false}
                  getItemLayout={(_, index) => ({
                    length: PHOTO_WIDTH,
                    offset: PHOTO_WIDTH * index,
                    index,
                  })}
                  renderItem={({ item: uri }) => (
                    <View style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT }}>
                      <Image
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                />
              </View>

              {/* Dots */}
              <View className="flex-row justify-center items-center py-3">
                {profile.photos.map((_, i) => (
                  <View
                    key={`dot-${i}`}
                    className="mx-1 rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: i === activePhotoIndex ? "#111827" : "#D1D5DB",
                    }}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View className="h-[240px] bg-gray-50 items-center justify-center">
              <Text className="text-sm text-gray-500">No photos yet</Text>
            </View>
          )}

          {/* Identity */}
          <View className="px-5 py-5">
            <Text className="text-2xl font-semibold text-gray-900">
              {profile?.displayName || "—"}
              {typeof profile?.age === "number" ? `, ${profile.age}` : ""}
            </Text>

            <Text className="mt-1 text-sm text-gray-600">
              {profile?.year ? profile.year : "—"}
              {profile?.gender ? ` • ${profile.gender}` : ""}
            </Text>

            {profile?.bio ? (
              <Text className="mt-4 text-sm text-gray-800 leading-5">{profile.bio}</Text>
            ) : (
              <Text className="mt-4 text-sm text-gray-500">No bio yet</Text>
            )}
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View className="mt-8 px-6">
        <Text className="text-lg font-semibold text-gray-900">Roommate preferences</Text>

        <View className="mt-3 rounded-3xl border border-gray-100 bg-white px-5 py-2">
          <Row label="Sleep schedule" value={profile?.sleepSchedule} />
          <Row label="Cleanliness" value={profile?.cleanlinessType} />
          <Row label="Noise tolerance" value={profile?.noiseToleration} />
          <Row label="Social type" value={profile?.socialType} />
          <Row label="Time at home" value={profile?.timeAtHome} />
          <Row label="Communication" value={profile?.desiredCommunication} />
          <Row label="Guests" value={profile?.guestFrequency} />
        </View>
      </View>

      {/* Housing */}
      <View className="mt-8 px-6">
        <Text className="text-lg font-semibold text-gray-900">Housing</Text>

        <View className="mt-3 rounded-3xl border border-gray-100 bg-white px-5 py-2">
          <Row label="Housing type" value={profile?.desiredHousingType} />
          <Row label="Room type" value={profile?.roomType} />
          <Row label="Has pet" value={profile?.hasPet} />
          <Row label="Smokes" value={profile?.smokes} />
          <Row label="Drinks" value={profile?.drinks} />
        </View>
      </View>

      {/* Interests */}
      <View className="mt-8 px-6">
        <Text className="text-lg font-semibold text-gray-900">Interests</Text>

        <View className="mt-3 rounded-3xl border border-gray-100 bg-white px-5 py-5">
          {profile?.interests?.length ? (
            <View className="flex-row flex-wrap">
              {profile.interests.map((i) => (
                <Chip key={i} label={i} />
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500">No interests selected</Text>
          )}
        </View>
      </View>

      {/* Account */}
      <View className="mt-8 px-6">
        <Text className="text-lg font-semibold text-gray-900">Account</Text>

        <View className="mt-3 rounded-3xl border border-gray-100 bg-white px-5 py-5">
          <Row label="Email" value={emailToShow} />

          <Pressable
            onPress={handleSignOut}
            className="mt-5 px-4 py-3 rounded-2xl border border-gray-200 items-center"
          >
            <Text className="text-sm text-gray-900">Sign out</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
