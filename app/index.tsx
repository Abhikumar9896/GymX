import { Redirect } from 'expo-router';
import { useGymXStore } from '@/store/useStore';

export default function Index() {
  const isLoggedIn = useGymXStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/welcome" />;
}
