import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W = SCREEN_W - 32;
const CARD_H = Math.min(SCREEN_H * 0.72, 640);
const PHOTO_H = Math.round(CARD_H * 0.60);

const PAGE_SIZE = 15;
const BATCH_SIZE = PAGE_SIZE;

// ---------- Types ----------
type UserDoc = {
  _id: string;
  name: string;
  email: string;
  clerkUserId?: string;
};

type ProfileDoc = {
  _id: string;
  user: UserDoc | string;

  displayName: string;
  age: number;
  year: string;
  gender: string;
  bio: string;

  sleepSchedule: string;
  cleanlinessType: string;
  noiseToleration: string;
  socialType: string;
  timeAtHome: string;
  desiredCommunication: string;

  interests: string[];

  desiredHousingType: string;
  roomType: string;

  hasPet: boolean;
  smokes: boolean;
  drinks: boolean;

  guestFrequency: string;

  photos: string[];
};

type FeedCard = ProfileDoc & {
  compatibilityScore: number;
  userName: string;
  userEmail: string;
};

// ---------- Compatibility scoring ----------
function jaccard(a: string[], b: string[]) {
  const A = new Set(a || []);
  const B = new Set(b || []);
  if (A.size === 0 && B.size === 0) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function boolMatch(a: boolean, b: boolean) {
  return a === b ? 1 : 0;
}

function eq(a?: string, b?: string) {
  return a && b && a === b ? 1 : 0;
}

// Weighted score -> 0..100
function computeCompatibility(me: ProfileDoc, them: ProfileDoc) {
  // You can tweak weights later
  const weights = {
    interests: 35,
    sleepSchedule: 10,
    desiredCommunication: 10,
    cleanlinessType: 8,
    noiseToleration: 8,
    socialType: 6,
    timeAtHome: 6,
    housingRoom: 5,
    lifestyle: 12, // pet/smoke/drink + guestFrequency
  };

  const interestsScore = jaccard(me.interests || [], them.interests || []);

  const sleepScore = eq(me.sleepSchedule, them.sleepSchedule);
  const commScore = eq(me.desiredCommunication, them.desiredCommunication);
  const cleanScore = eq(me.cleanlinessType, them.cleanlinessType);
  const noiseScore = eq(me.noiseToleration, them.noiseToleration);
  const socialScore = eq(me.socialType, them.socialType);
  const homeScore = eq(me.timeAtHome, them.timeAtHome);

  const housingRoomScore =
    (eq(me.desiredHousingType, them.desiredHousingType) + eq(me.roomType, them.roomType)) / 2;

  const lifestyleScore =
    (boolMatch(me.hasPet, them.hasPet) +
      boolMatch(me.smokes, them.smokes) +
      boolMatch(me.drinks, them.drinks) +
      eq(me.guestFrequency, them.guestFrequency)) /
    4;

  const raw =
    interestsScore * weights.interests +
    sleepScore * weights.sleepSchedule +
    commScore * weights.desiredCommunication +
    cleanScore * weights.cleanlinessType +
    noiseScore * weights.noiseToleration +
    socialScore * weights.socialType +
    homeScore * weights.timeAtHome +
    housingRoomScore * weights.housingRoom +
    lifestyleScore * weights.lifestyle;

  // ensure 0..100 integer
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// ---------- Photo carousel with dots ----------
function PhotoCarousel({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  const data = photos?.length ? photos : [];

  useEffect(() => {
    // reset index when card changes / photos change
    setIdx(0);
  }, [photos?.length]);

  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(data.length - 1, i + 1));

  return (
    <View style={{ height: PHOTO_H }} className="rounded-3xl overflow-hidden bg-gray-100">
      {data.length ? (
        <>
          <Image
            source={{ uri: data[idx] }}
            style={{ width: CARD_W, height: PHOTO_H }}
            resizeMode="cover"
          />

          {/* Tap zones */}
          <View className="absolute inset-0 flex-row">
            <Pressable
              onPress={goPrev}
              style={{ width: "45%", height: "100%" }}
              hitSlop={10}
            />
            <View style={{ width: "10%", height: "100%" }} pointerEvents="none" />
            <Pressable
              onPress={goNext}
              style={{ width: "45%", height: "100%" }}
              hitSlop={10}
            />
          </View>

          {/* Dots */}
          <View className="absolute bottom-3 w-full items-center justify-center">
            <View className="flex-row bg-black/30 px-3 py-1 rounded-full">
              {data.map((_, i) => (
                <View
                  key={i}
                  className="mx-1 rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: i === idx ? "white" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </View>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No photos</Text>
        </View>
      )}
    </View>
  );
}

// ---------- Expand modal ----------
function ExpandedProfileModal({
  visible,
  onClose,
  card,
}: {
  visible: boolean;
  onClose: () => void;
  card: FeedCard | null;
}) {
  if (!card) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl overflow-hidden" style={{ maxHeight: "88%" }}>
          <View className="px-5 pt-4 pb-3 border-b border-gray-100 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              {card.displayName}, {card.age}
            </Text>
            <Pressable onPress={onClose} className="px-4 py-2 rounded-full bg-gray-100">
              <Text className="text-gray-900">Close</Text>
            </Pressable>
          </View>

          <ScrollView className="px-5 pt-4" contentContainerStyle={{ paddingBottom: 28 }}>
            <Text className="text-sm text-gray-700">
              Compatibility: <Text className="font-semibold">{card.compatibilityScore}%</Text>
            </Text>

            <View className="mt-4">
              <Text className="text-sm font-semibold text-gray-900">Basics</Text>
              <Text className="text-sm text-gray-700 mt-1">
                Year: {card.year} • Gender: {card.gender}
              </Text>
              <Text className="text-sm text-gray-700 mt-1">
                Housing: {card.desiredHousingType} • Room: {card.roomType}
              </Text>
            </View>

            <View className="mt-5">
              <Text className="text-sm font-semibold text-gray-900">Bio</Text>
              <Text className="text-sm text-gray-700 mt-1">{card.bio}</Text>
            </View>

            <View className="mt-5">
              <Text className="text-sm font-semibold text-gray-900">Preferences</Text>
              <Text className="text-sm text-gray-700 mt-1">Sleep: {card.sleepSchedule}</Text>
              <Text className="text-sm text-gray-700 mt-1">Cleanliness: {card.cleanlinessType}</Text>
              <Text className="text-sm text-gray-700 mt-1">Noise: {card.noiseToleration}</Text>
              <Text className="text-sm text-gray-700 mt-1">Social: {card.socialType}</Text>
              <Text className="text-sm text-gray-700 mt-1">Time at home: {card.timeAtHome}</Text>
              <Text className="text-sm text-gray-700 mt-1">
                Communication: {card.desiredCommunication}
              </Text>
              <Text className="text-sm text-gray-700 mt-1">Guests: {card.guestFrequency}</Text>
            </View>

            <View className="mt-5">
              <Text className="text-sm font-semibold text-gray-900">Lifestyle</Text>
              <Text className="text-sm text-gray-700 mt-1">Has pet: {card.hasPet ? "Yes" : "No"}</Text>
              <Text className="text-sm text-gray-700 mt-1">Smokes: {card.smokes ? "Yes" : "No"}</Text>
              <Text className="text-sm text-gray-700 mt-1">Drinks: {card.drinks ? "Yes" : "No"}</Text>
            </View>

            <View className="mt-5">
              <Text className="text-sm font-semibold text-gray-900">Interests</Text>
              <View className="flex-row flex-wrap mt-2">
                {(card.interests || []).map((i) => (
                  <View
                    key={i}
                    className="mr-2 mb-2 px-3 py-1 rounded-full border border-gray-200"
                  >
                    <Text className="text-xs text-gray-800">{i}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-6">
              <Text className="text-xs text-gray-400">(User email for debugging: {card.userEmail})</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function HomeSwipeScreen() {
  const { user } = useUser();
  const clerkId = user?.id;

  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const [me, setMe] = useState<ProfileDoc | null>(null);

  const [cards, setCards] = useState<FeedCard[]>([]);
  const [cursor, setCursor] = useState(0); // skip value
  const [swipedCount, setSwipedCount] = useState(0);

  const [expanded, setExpanded] = useState<FeedCard | null>(null);

  const swiperRef = useRef<Swiper<FeedCard>>(null);

  const endpointMe = useMemo(() => {
    if (!API_BASE || !clerkId) return null;
    return `${API_BASE}/api/v1/profile/by-clerk/${clerkId}`;
  }, [clerkId]);

  const endpointFeed = useMemo(() => {
    if (!API_BASE || !clerkId) return null;
    return `${API_BASE}/api/v1/feed/by-clerk/${clerkId}`;
  }, [clerkId]);

  const hydrateAndSort = useCallback((meProfile: ProfileDoc, incoming: ProfileDoc[]) => {
    const mapped: FeedCard[] = incoming.map((p) => {
      const u = (p.user as any) as UserDoc;
      const score = computeCompatibility(meProfile, p);

      return {
        ...p,
        compatibilityScore: score,
        userName: u?.name || "",
        userEmail: u?.email || "",
      };
    });

    mapped.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    return mapped;
  }, []);

  const fetchMe = useCallback(async () => {
    if (!endpointMe) return null;
    const res = await axios.get(endpointMe, { timeout: 10000 });
    return (res.data?.data?.profile as ProfileDoc) || null;
  }, [endpointMe]);

  const fetchBatch = useCallback(
    async (skip: number, limit: number) => {
      if (!endpointFeed) return [];
      const res = await axios.get(endpointFeed, {
        params: { skip, limit },
        timeout: 12000,
      });
      return (res.data?.data?.profiles as ProfileDoc[]) || [];
    },
    [endpointFeed]
  );

  const initialLoad = useCallback(async () => {
    if (!API_BASE) return;
    if (!clerkId) return;

    setLoading(true);
    try {
      const myProfile = await fetchMe();
      if (!myProfile) {
        setLoading(false);
        return;
      }
      setMe(myProfile);

      const batch = await fetchBatch(0, BATCH_SIZE);
      const sorted = hydrateAndSort(myProfile, batch);

      setCards(sorted);
      setCursor(batch.length);
      setSwipedCount(0);
    } catch (e) {
      console.error("Home feed init failed:", e);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, clerkId, fetchMe, fetchBatch, hydrateAndSort]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const loadMoreIfNeeded = useCallback(
    async (nextSwipedCount: number) => {
      if (!me) return;
      if (fetchingMore) return;

      if (nextSwipedCount > 0 && nextSwipedCount % BATCH_SIZE === 0) {
        setFetchingMore(true);
        try {
          const batch = await fetchBatch(cursor, BATCH_SIZE);
          const sorted = hydrateAndSort(me, batch);

          await new Promise((r) => setTimeout(r, 700));

          setCards(sorted);
          setCursor((c) => c + batch.length);
          setSwipedCount(0);

          swiperRef.current?.jumpToCardIndex?.(0);
        } catch (e) {
          console.error("Fetch more failed:", e);
        } finally {
          setFetchingMore(false);
        }
      }
    },
    [me, cursor, fetchingMore, fetchBatch, hydrateAndSort]
  );

  const onSwiped = useCallback(
    (cardIndex: number) => {
      const next = swipedCount + 1;
      setSwipedCount(next);
      loadMoreIfNeeded(next);
    },
    [swipedCount, loadMoreIfNeeded]
  );

  const onSwipedRight = useCallback((index: number) => {}, []);
  const onSwipedLeft = useCallback((index: number) => {}, []);

  const renderCard = (card: FeedCard) => {
    if (!card) return null;

    const score = Math.max(0, Math.min(100, card.compatibilityScore));
    const topInterests = (card.interests || []).slice(0, 5);

    return (
      <View
        style={{ width: CARD_W, height: CARD_H }}
        className="bg-white rounded-[28px] overflow-hidden border border-gray-100"
      >
        <PhotoCarousel photos={card.photos || []} />

        {/* MORE NOTICEABLE compatibility badge */}
        <View className="absolute top-4 left-4">
          <View className="bg-white/95 px-4 py-3 rounded-2xl border border-gray-100">
            <Text className="text-[11px] text-gray-600 font-semibold">Compatibility</Text>
            <Text className="text-2xl text-gray-900 font-extrabold leading-7">
              {score}
              <Text className="text-base font-extrabold">%</Text>
            </Text>

            {/* tiny progress bar */}
            <View className="mt-2 h-2 w-28 rounded-full bg-gray-200 overflow-hidden">
              <View style={{ width: `${score}%` }} className="h-2 bg-green-500" />
            </View>
          </View>
        </View>

        {/* Expand button */}
        <View className="absolute top-4 right-4">
          <Pressable
            onPress={() => setExpanded(card)}
            className="bg-white/90 px-3 py-2 rounded-full"
          >
            <Text className="text-xs text-gray-900 font-semibold">Expand</Text>
          </Pressable>
        </View>

        {/* Info area */}
        <View className="px-5 pt-4">
          <Text className="text-2xl font-semibold text-gray-900">
            {card.displayName}, {card.age}
          </Text>

          <Text className="text-sm text-gray-700 mt-1">
            {card.year} • {card.gender}
          </Text>

          {/* Housing + Room + Interests together */}
          <View className="flex-row flex-wrap mt-3">
            <View className="mr-2 mb-2 px-3 py-1 rounded-full border border-gray-200">
              <Text className="text-xs text-gray-800">{card.desiredHousingType}</Text>
            </View>
            <View className="mr-2 mb-2 px-3 py-1 rounded-full border border-gray-200">
              <Text className="text-xs text-gray-800">{card.roomType}</Text>
            </View>

            {topInterests.map((i) => (
              <View key={i} className="mr-2 mb-2 px-3 py-1 rounded-full bg-indigo-50">
                <Text className="text-xs font-semibold text-indigo-700">{i}</Text>
              </View>
            ))}
          </View>

          {/* small preview */}
          <Text className="text-sm text-gray-700 mt-2" numberOfLines={3}>
            {card.bio}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    // IMPORTANT: top padding so the title area has space
    <View className="flex-1 bg-white">
      {/* FIXED HEADER: stays while user swipes */}
      <View className="px-5 pt-16 pb-2">
        <Text className="text-5xl font-semibold text-primaryRed" style={{marginBottom: -10}}>RU Roomie</Text>
      </View>

      {/* overlay spinner when fetching next batch */}
      {fetchingMore ? (
        <View className="absolute inset-0 items-center justify-center bg-white/70 z-50">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-sm text-gray-700">Loading more matches...</Text>
        </View>
      ) : null}

      <View className="flex-1 items-center justify-center" style={{marginTop: -40}}>
        {cards.length ? (
          <Swiper
            ref={swiperRef as any}
            cards={cards}
            renderCard={renderCard}
            onSwiped={onSwiped}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            cardIndex={0}
            backgroundColor={"transparent"}
            stackSize={3}
            stackSeparation={14}
            animateCardOpacity
            disableTopSwipe
            disableBottomSwipe
            verticalSwipe={false}
            horizontalSwipe
            containerStyle={{ alignItems: "center", justifyContent: "center" }}
            cardStyle={{ borderRadius: 28 }}
          />
        ) : (
          <View className="items-center justify-center px-8">
            <Text className="text-xl font-semibold text-gray-900">No matches yet</Text>
            <Text className="text-sm text-gray-600 mt-2 text-center">
              Check back soon. We’ll pull more profiles as they join.
            </Text>

            <Pressable
              onPress={initialLoad}
              className="mt-6 px-5 py-3 rounded-2xl"
              style={{ backgroundColor: "#cf1405" }}
            >
              <Text className="text-white font-semibold">Reload</Text>
            </Pressable>
          </View>
        )}

        <ExpandedProfileModal visible={!!expanded} onClose={() => setExpanded(null)} card={expanded} />
      </View>
    </View>
  );
}
