import { useColorScheme } from 'react-native';
import { useGymXStore } from '@/store/useStore';
import { Colors } from '@/constants/theme';

export const useAppTheme = () => {
    const systemColorScheme = useColorScheme();
    const themePreference = useGymXStore((state) => state.themePreference);
    
    const colorScheme = themePreference === 'system' ? (systemColorScheme ?? 'dark') : themePreference;
    const theme = Colors[colorScheme === 'light' ? 'light' : 'dark'];
    
    return {
        colorScheme,
        theme,
        isDark: colorScheme === 'dark',
    };
};
