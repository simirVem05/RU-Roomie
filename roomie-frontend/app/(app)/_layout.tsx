import { Stack, Redirect } from 'expo-router';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}

export default function AppLayout() {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <Loading />;

  return (
    <>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedIn>

      <SignedOut>
        <Redirect href="/sign-in" />
      </SignedOut>
    </>
  );
}
