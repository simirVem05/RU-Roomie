import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Dimensions, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';

// ---- Types ----
export type MatchCard = {
  id: string;
  name: string;
  age?: number;
  program?: string; // e.g., "CS Junior"
  bio?: string;
  images: string[]; // at least one URL
  badges?: string[]; // e.g., ["Early bird", "Non-smoker"]
};

// ---- Config ----
const API_BASE = 'https://your-api.com'; // TODO: swap with your env, e.g., process.env.EXPO_PUBLIC_API_URL
const MATCHES_ENDPOINT = `${API_BASE}/api/matches`;
const SWIPE_ENDPOINT = `${API_BASE}/api/swipes`;

const { width } = Dimensions.get('window');

export default function SwipeScreen() {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<Swiper<MatchCard>>(null);

  // Demo data
  const demoCards: MatchCard[] = useMemo(
    () => [
      {
        id: 'demo-1',
        name: 'Alex',
        age: 21,
        program: 'CS Junior',
        images: [
          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1200&auto=format&fit=crop&q=60',
        ],
        bio: 'Night owl • Gym • Clean',
        badges: ['Night owl', 'Non-smoker', 'No pets'],
      },
      {
        id: 'demo-2',
        name: 'Sam',
        age: 20,
        program: 'Math Sophomore',
        images: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&auto=format&fit=crop&q=60',
        ],
        bio: 'Early bird • Coffee • Quiet',
        badges: ['Early bird', 'Allergies', 'Quiet'],
      },
    ],
    []
  );

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<{ matches: MatchCard[] }>(MATCHES_ENDPOINT);
      const data = res.data?.matches ?? [];
      setCards(data.length ? data : demoCards);
    } catch (e: any) {
      console.warn('Failed to fetch matches, using demo data', e?.message);
      setCards(demoCards);
      setError('Could not reach matches API; showing demo data');
    } finally {
      setLoading(false);
    }
  }, [demoCards]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const sendSwipe = useCallback(async (targetId: string, action: 'like' | 'pass' | 'superlike') => {
    try {
      await axios.post(SWIPE_ENDPOINT, { targetId, action });
    } catch (e: any) {
      console.warn('Swipe API error:', e?.message);
    }
  }, []);

  const onSwiped = useCallback(
    (cardIndex: number, direction: 'left' | 'right' | 'top') => {
      const card = cards[cardIndex];
      if (!card) return;
      if (direction === 'right') sendSwipe(card.id, 'like');
      if (direction === 'left') sendSwipe(card.id, 'pass');
      if (direction === 'top') sendSwipe(card.id, 'superlike');
    },
    [cards, sendSwipe]
  );

  const onSwipedAll = useCallback(() => {
    Alert.alert('No more matches', 'Pull more from the server?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reload', onPress: fetchMatches },
    ]);
  }, [fetchMatches]);

  const handleManualSwipe = (dir: 'left' | 'right' | 'top') => {
    const api: any = swiperRef.current;
    if (!api) return;
    if (dir === 'left') api.swipeLeft();
    if (dir === 'right') api.swipeRight();
    if (dir === 'top') api.swipeTop();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading matches…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {error ? (
        <Text style={[styles.muted, { textAlign: 'center', marginBottom: 6 }]}>{error}</Text>
      ) : null}

      <View style={styles.deckWrap}>
        <Swiper
          ref={swiperRef}
          cards={cards}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={14}
          cardIndex={0}
          disableBottomSwipe
          animateOverlayLabelsOpacity
          animateCardOpacity
          verticalSwipe={true}
          onSwipedLeft={(i) => onSwiped(i, 'left')}
          onSwipedRight={(i) => onSwiped(i, 'right')}
          onSwipedTop={(i) => onSwiped(i, 'top')}
          onSwipedAll={onSwipedAll}
          renderCard={(card) => (card ? <Card card={card} /> : <EmptyCard />)}
          overlayLabels={overlayLabels}
          containerStyle={{ backgroundColor: 'transparent' }}
          cardVerticalMargin={20}
          cardHorizontalMargin={0}
          cardStyle={styles.cardShadow}
        />
      </View>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <CircleButton label="NOPE" color="#ef4444" onPress={() => handleManualSwipe('left')} />
        <CircleButton label="LIKE" color="#22c55e" onPress={() => handleManualSwipe('right')} />
        <CircleButton label="SUPER" color="#3b82f6" onPress={() => handleManualSwipe('top')} />
      </View>
    </SafeAreaView>
  );
}

// ---- Card components ----
function Card({ card }: { card: MatchCard }) {
  const img = card.images?.[0];
  return (
    <View style={styles.card}>
      {img ? (
        <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}> 
          <Text style={styles.placeholderText}>{card.name?.[0] ?? '?'}</Text>
        </View>
      )}

      {/* Gradient-ish footer with info */}
      <View style={styles.footer}> 
        <Text style={styles.title} numberOfLines={1}>
          {card.name}{card.age ? `, ${card.age}` : ''}
        </Text>
        {card.program ? (
          <Text style={styles.subtitle} numberOfLines={1}>{card.program}</Text>
        ) : null}
        {card.bio ? (
          <Text style={styles.bio} numberOfLines={2}>{card.bio}</Text>
        ) : null}

        {/* Badges */}
        <View style={styles.badgesRow}>
          {(card.badges ?? []).slice(0, 3).map((b) => (
            <View key={b} style={styles.badge}><Text style={styles.badgeText}>{b}</Text></View>
          ))}
        </View>
      </View>
    </View>
  );
}

function EmptyCard() {
  return (
    <View style={[styles.card, styles.placeholder]}> 
      <Text style={styles.title}>No cards</Text>
    </View>
  );
}

function CircleButton({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.circleBtn, { borderColor: color }]}> 
      <Text style={[styles.circleLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---- Overlay labels (LIKE/NOPE/SUPER) ----
const overlayLabels = {
  left: {
    title: 'NOPE',
    style: {
      label: {
        backgroundColor: 'transparent',
        borderColor: '#ef4444',
        borderWidth: 4,
        color: '#ef4444',
        fontSize: 40,
        fontWeight: '800',
        padding: 8,
      },
      wrapper: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: -30,
      },
    },
  },
  right: {
    title: 'LIKE',
    style: {
      label: {
        backgroundColor: 'transparent',
        borderColor: '#22c55e',
        borderWidth: 4,
        color: '#22c55e',
        fontSize: 40,
        fontWeight: '800',
        padding: 8,
      },
      wrapper: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: 30,
      },
    },
  },
  top: {
    title: 'SUPER',
    style: {
      label: {
        backgroundColor: 'transparent',
        borderColor: '#3b82f6',
        borderWidth: 4,
        color: '#3b82f6',
        fontSize: 36,
        fontWeight: '800',
        padding: 8,
      },
      wrapper: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10,
      },
    },
  },
} as const;

// ---- Styles ----
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  muted: { color: '#6b7280' },
  deckWrap: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  card: {
    width: width - 32,
    height: Math.min(620, Math.round((width - 32) * 1.25)),
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  image: { width: '100%', height: '68%' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 48, fontWeight: '700', color: '#9ca3af' },
  footer: { padding: 14, gap: 4, backgroundColor: 'rgba(255,255,255,0.96)', height: '32%' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280' },
  bio: { fontSize: 13, color: '#374151' },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  badge: { borderWidth: 1, borderColor: '#d1d5db', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999, backgroundColor: '#fff' },
  badgeText: { fontSize: 12, color: '#374151' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  circleBtn: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  circleLabel: { fontSize: 16, fontWeight: '800' },
});
