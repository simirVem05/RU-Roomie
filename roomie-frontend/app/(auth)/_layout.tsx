import { Stack, Redirect, usePathname } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  if (!isLoaded) return null; // avoid flicker while Clerk initializes

  // Treat these as "auth landing" pages that should bounce signed-in users
  const shouldBounceIfSignedIn =
    pathname === '/sign-in' || pathname === '/log-in';

  // BUT: do NOT bounce on /sign-up. Let the screen finish its verification flow
  // and navigate on its own (prevents the blank white screen race).
  if (isSignedIn && shouldBounceIfSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}