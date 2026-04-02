import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { EXERCISES, CATEGORIES } from '@/constants/exercises';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

const preloadImages = async () => {
  try {
    const urlsToPrefetch = [
      ...CATEGORIES.map(c => c.image),
      ...Object.values(EXERCISES).flatMap(list => list.map(e => e.image))
    ].filter(Boolean);

    await Image.prefetch(urlsToPrefetch);
    console.log('Successfully preloaded all images.');
  } catch (e) {
    console.log('Failed to preload images', e);
  }
};

import { useGymXStore } from '@/store/useStore';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const { theme, colorScheme, isDark } = useAppTheme();
  const isLoggedIn = useGymXStore((state) => state.isLoggedIn);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    
    if (!isLoggedIn && inAuthGroup) {
      // Redirect to welcome if not logged in and trying to access tabs
      router.replace('/welcome');
    } else if (isLoggedIn && (segments[0] === 'welcome' || segments[0] === 'login' || segments[0] === 'signup')) {
      // Redirect to tabs if already logged in and on auth screens
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="welcome">
        <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="signup" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="exercise-list/[category]" options={{ headerShown: false }} />
        <Stack.Screen name="exercise-detail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="bmi" options={{ headerShown: false }} />
        <Stack.Screen name="active-workout" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Details' }} />
      </Stack>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
