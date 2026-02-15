import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const INTERESTS = [
  "Traveling",
  "Working Out",
  "Sports",
  "Movies",
  "Music",
  "Nightlife",
  "Outdoors Activities",
  "Shopping",
  "Running",
  "Yoga",
  "Pilates",
  "Meditation",
  "Anime",
  "Art",
  "Dancing",
  "Photography",
  "Cooking",
  "Baking",
  "Politics",
  "Theatre",
  "Animals",
  "Philosophy",
  "Reading",
  "Video Games",
  "Cars",
  "Gardening",
] as const;

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"] as const;
const GENDER_OPTIONS = ["Female", "Male", "Nonbinary", "Other"] as const;
const SLEEP_OPTIONS = ["Early Bird", "Night Owl", "Flexible"] as const;
const CLEAN_OPTIONS = ["Messy Slob", "Disorganized", "Organized", "Neat Freak"] as const;
const NOISE_OPTIONS = ["Very Little Noise", "Moderate Noise", "Heavy Noise", "Any Noise"] as const;
const SOCIAL_OPTIONS = ["Introvert", "Lean Introverted", "Lean Extroverted", "Extrovert"] as const;
const HOME_OPTIONS = ["Always Home", "Usually Home", "Mixed", "Usually Not At Home", "Never Home"] as const;
const COMM_OPTIONS = ["Only When Necessary", "We Can Be Cool", "Let's Be Friends", "Let's Be Best Friends"] as const;
const HOUSING_OPTIONS = ["Dorm", "Apartment", "House"] as const;
const ROOM_OPTIONS = ["Single", "Double"] as const;
const GUEST_OPTIONS = ["Never", "Rarely", "Sometimes", "Often"] as const;

type Profile = {
  _id: string;
  displayName: string;
  age: number;
  year: (typeof YEAR_OPTIONS)[number];
  gender: (typeof GENDER_OPTIONS)[number];
  bio: string;

  sleepSchedule: (typeof SLEEP_OPTIONS)[number];
  cleanlinessType: (typeof CLEAN_OPTIONS)[number];
  noiseToleration: (typeof NOISE_OPTIONS)[number];
  socialType: (typeof SOCIAL_OPTIONS)[number];
  timeAtHome: (typeof HOME_OPTIONS)[number];
  desiredCommunication: (typeof COMM_OPTIONS)[number];

  interests: string[];

  desiredHousingType: (typeof HOUSING_OPTIONS)[number];
  roomType: (typeof ROOM_OPTIONS)[number];

  hasPet: boolean;
  smokes: boolean;
  drinks: boolean;

  guestFrequency: (typeof GUEST_OPTIONS)[number];

  photos: string[];
};

function PillSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <View className="mt-6">
      <Text className="text-sm font-semibold text-gray-900">{label}</Text>
      <View className="flex-row flex-wrap mt-3">
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              className="mr-2 mb-2 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: selected ? "#111827" : "white",
                borderColor: selected ? "#111827" : "#E5E7EB",
              }}
            >
              <Text style={{ color: selected ? "white" : "#111827" }} className="text-xs">
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BoolToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="mt-4 flex-row items-center justify-between">
      <Text className="text-sm text-gray-900">{label}</Text>
      <Pressable
        onPress={() => onChange(!value)}
        className="px-4 py-2 rounded-full border"
        style={{
          backgroundColor: value ? "#111827" : "white",
          borderColor: value ? "#111827" : "#E5E7EB",
        }}
      >
        <Text className="text-xs" style={{ color: value ? "white" : "#111827" }}>
          {value ? "Yes" : "No"}
        </Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
  maxLength?: number;
}) {
  return (
    <View className="mt-6">
      <Text className="text-sm font-semibold text-gray-900">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType || "default"}
        multiline={multiline}
        maxLength={maxLength}
        className="mt-3 px-4 py-3 rounded-2xl border border-gray-200 text-gray-900"
        style={{
          minHeight: multiline ? 110 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
        }}
      />
      {typeof maxLength === "number" ? (
        <Text className="mt-2 text-xs text-gray-500">
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

export default function ProfileEditScreen() {
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState<(typeof YEAR_OPTIONS)[number]>("Freshman");
  const [gender, setGender] = useState<(typeof GENDER_OPTIONS)[number]>("Male");
  const [bio, setBio] = useState("");

  const [sleepSchedule, setSleepSchedule] =
    useState<(typeof SLEEP_OPTIONS)[number]>("Flexible");
  const [cleanlinessType, setCleanlinessType] =
    useState<(typeof CLEAN_OPTIONS)[number]>("Organized");
  const [noiseToleration, setNoiseToleration] =
    useState<(typeof NOISE_OPTIONS)[number]>("Moderate Noise");
  const [socialType, setSocialType] =
    useState<(typeof SOCIAL_OPTIONS)[number]>("Lean Extroverted");
  const [timeAtHome, setTimeAtHome] =
    useState<(typeof HOME_OPTIONS)[number]>("Mixed");
  const [desiredCommunication, setDesiredCommunication] =
    useState<(typeof COMM_OPTIONS)[number]>("We Can Be Cool");

  const [interests, setInterests] = useState<string[]>([]);

  const [desiredHousingType, setDesiredHousingType] =
    useState<(typeof HOUSING_OPTIONS)[number]>("Dorm");
  const [roomType, setRoomType] =
    useState<(typeof ROOM_OPTIONS)[number]>("Double");

  const [hasPet, setHasPet] = useState(false);
  const [smokes, setSmokes] = useState(false);
  const [drinks, setDrinks] = useState(false);

  const [guestFrequency, setGuestFrequency] =
    useState<(typeof GUEST_OPTIONS)[number]>("Sometimes");

  // photos are local URIs (same as onboarding)
  const [photos, setPhotos] = useState<string[]>([]);

  const endpointGet = useMemo(() => {
    if (!API_BASE || !clerkId) return null;
    return `${API_BASE}/api/v1/profile/by-clerk/${clerkId}`;
  }, [clerkId]);

  const endpointSave = useMemo(() => {
    if (!API_BASE) return null;
    return `${API_BASE}/api/v1/profile`;
  }, []);

  const hydrate = (p: Profile) => {
    setDisplayName(p.displayName || "");
    setAge(String(p.age ?? ""));
    setYear(p.year);
    setGender(p.gender);
    setBio(p.bio || "");

    setSleepSchedule(p.sleepSchedule);
    setCleanlinessType(p.cleanlinessType);
    setNoiseToleration(p.noiseToleration);
    setSocialType(p.socialType);
    setTimeAtHome(p.timeAtHome);
    setDesiredCommunication(p.desiredCommunication);

    setInterests(Array.isArray(p.interests) ? p.interests : []);
    setDesiredHousingType(p.desiredHousingType);
    setRoomType(p.roomType);

    setHasPet(!!p.hasPet);
    setSmokes(!!p.smokes);
    setDrinks(!!p.drinks);

    setGuestFrequency(p.guestFrequency);

    // these might be URLs or local URIs — we just render them
    setPhotos(Array.isArray(p.photos) ? p.photos.slice(0, 6) : []);
  };

  const fetchProfile = useCallback(async () => {
    if (!endpointGet) return;
    setErrorMsg(null);

    try {
      const res = await axios.get(endpointGet);
      const p = res.data?.data?.profile as Profile | undefined;
      if (!p) {
        setErrorMsg("No profile found.");
        return;
      }
      hydrate(p);
    } catch (e: any) {
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Failed to load profile."
      );
    }
  }, [endpointGet]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    };
    run();
  }, [fetchProfile]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((x) => x !== interest)
        : [...prev, interest]
    );
  };

  const validate = () => {
    const ageNum = Number(age);
    if (!displayName.trim()) return "Display name is required.";
    if (!bio.trim()) return "Bio is required.";
    if (!Number.isFinite(ageNum) || ageNum < 17)
      return "Age must be a number and at least 17.";
    if (photos.length > 6) return "You can upload up to 6 photos.";
    return null;
  };

  // ---- photos: same as onboarding ----
  const pickPhotos = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Please allow photo library access to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: Math.max(0, 6 - photos.length),
    });

    if (result.canceled) return;

    const newUris = result.assets.map((a) => a.uri);

    setPhotos((prev) => {
      const merged = [...prev, ...newUris];
      const deduped = Array.from(new Set(merged));
      return deduped.slice(0, 6);
    });
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const onSave = async () => {
    const msg = validate();
    if (msg) {
      Alert.alert("Fix this first", msg);
      return;
    }

    if (!endpointSave) {
      Alert.alert("Config error", "EXPO_PUBLIC_API_URL is not set");
      return;
    }

    if (!clerkId) {
      Alert.alert("Auth error", "No Clerk user found");
      return;
    }

    if (saving) return;

    setSaving(true);
    try {
      const payload = {
        displayName: displayName.trim(),
        age: Number(age),
        year,
        gender,
        bio: bio.trim(),

        sleepSchedule,
        cleanlinessType,
        noiseToleration,
        socialType,
        timeAtHome,
        desiredCommunication,

        interests,

        desiredHousingType,
        roomType,

        hasPet,
        smokes,
        drinks,

        guestFrequency,

        // local URIs (same as onboarding)
        photos,
      };

      await axios.post(endpointSave, {
        clerkUserId: clerkId,
        ...payload,
      });

      router.back();
    } catch (e: any) {
      Alert.alert(
        "Save failed",
        e?.response?.data?.message || e?.message || "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
      <View className="px-6 pt-14">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-gray-900">Edit profile</Text>
        </View>

        {errorMsg ? (
          <View className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-700">{errorMsg}</Text>
          </View>
        ) : null}

        <Field label="Display name" value={displayName} onChangeText={setDisplayName} />
        <Field label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
        <PillSelect label="Year" value={year} options={YEAR_OPTIONS} onChange={setYear} />
        <PillSelect label="Gender" value={gender} options={GENDER_OPTIONS} onChange={setGender} />
        <Field label="Bio" value={bio} onChangeText={setBio} multiline maxLength={500} />

        <PillSelect label="Sleep schedule" value={sleepSchedule} options={SLEEP_OPTIONS} onChange={setSleepSchedule} />
        <PillSelect label="Cleanliness" value={cleanlinessType} options={CLEAN_OPTIONS} onChange={setCleanlinessType} />
        <PillSelect label="Noise tolerance" value={noiseToleration} options={NOISE_OPTIONS} onChange={setNoiseToleration} />
        <PillSelect label="Social type" value={socialType} options={SOCIAL_OPTIONS} onChange={setSocialType} />
        <PillSelect label="Time at home" value={timeAtHome} options={HOME_OPTIONS} onChange={setTimeAtHome} />
        <PillSelect label="Communication" value={desiredCommunication} options={COMM_OPTIONS} onChange={setDesiredCommunication} />
        <PillSelect label="Guest frequency" value={guestFrequency} options={GUEST_OPTIONS} onChange={setGuestFrequency} />

        <PillSelect label="Housing type" value={desiredHousingType} options={HOUSING_OPTIONS} onChange={setDesiredHousingType} />
        <PillSelect label="Room type" value={roomType} options={ROOM_OPTIONS} onChange={setRoomType} />

        <View className="mt-6 rounded-3xl border border-gray-100 bg-white px-5 py-5">
          <Text className="text-sm font-semibold text-gray-900">Lifestyle</Text>
          <BoolToggle label="Has pet" value={hasPet} onChange={setHasPet} />
          <BoolToggle label="Smokes" value={smokes} onChange={setSmokes} />
          <BoolToggle label="Drinks" value={drinks} onChange={setDrinks} />
        </View>

        <View className="mt-6">
          <Text className="text-sm font-semibold text-gray-900">Interests</Text>
          <View className="flex-row flex-wrap mt-3">
            {INTERESTS.map((i) => {
              const selected = interests.includes(i);
              return (
                <Pressable
                  key={i}
                  onPress={() => toggleInterest(i)}
                  className="mr-2 mb-2 px-4 py-2 rounded-full border"
                  style={{
                    backgroundColor: selected ? "#111827" : "white",
                    borderColor: selected ? "#111827" : "#E5E7EB",
                  }}
                >
                  <Text style={{ color: selected ? "white" : "#111827" }} className="text-xs">
                    {i}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Photos section: match onboarding Photos.tsx UX */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-900">Photos</Text>
            <Text className="text-xs text-gray-500">{photos.length}/6</Text>
          </View>

          <View className="flex-row flex-wrap justify-between mt-4">
            {photos.map((uri) => (
              <Pressable
                key={uri}
                onPress={() => removePhoto(uri)}
                className="w-[48%] aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100"
              >
                <Image source={{ uri }} className="w-full h-full" />
                <View className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs">Remove</Text>
                </View>
              </Pressable>
            ))}

            {photos.length < 6 && (
              <Pressable
                onPress={pickPhotos}
                className="w-[48%] aspect-square mb-4 rounded-2xl bg-gray-100 items-center justify-center"
              >
                <Text className="text-3xl text-gray-500">+</Text>
                <Text className="text-gray-500 mt-2">Add Photo</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View className="mt-10 flex-row">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 items-center"
          >
            <Text className="text-sm text-gray-900">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={onSave}
            disabled={saving}
            className="flex-1 ml-3 px-4 py-3 rounded-2xl items-center"
            style={{ backgroundColor: saving ? "#9CA3AF" : "#cf1405" }}
          >
            <Text className="text-sm text-white">
              {saving ? "Saving..." : "Save changes"}
            </Text>
          </Pressable>
        </View>

        <View className="h-10" />
      </View>
    </ScrollView>
  );
}
