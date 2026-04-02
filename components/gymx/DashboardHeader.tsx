import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useGymXStore } from '@/store/useStore';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

export const DashboardHeader = () => {
  const user = useGymXStore((state) => state.user);
  const { theme, colorScheme } = useAppTheme();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.userNameText, { color: theme.text }]} numberOfLines={1}>
            {getGreeting()}, {user.name.split(' ')[0]}! 💪
          </Text>
          <Text style={[styles.greetingText, { color: theme.icon }]} numberOfLines={1}>
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'long' })}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={async () => {
            try {
              const Constants = require('expo-constants').default || require('expo-constants');
              const { Platform } = require('react-native');
              
              if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
                 alert('Note: Expo removed notification testing from Expo Go App. Please run "npx expo run:android" to test notifications!');
                 return;
              }

              const Notifications = require('expo-notifications');
              if (Notifications && Notifications.scheduleNotificationAsync) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Test Successful! 🚀",
                    body: "Background notifications are working perfectly even if you close the app.",
                    sound: true,
                  },
                  trigger: { seconds: 5 },
                });
                alert('Notification scheduled! Close the app in the next 5 seconds to test.');
              } else {
                 alert('Notifications API is not available in this environment. Try a development build.');
              }
            } catch (e) {
               alert('Please run a development build (npx expo run) to test notifications.');
            }
          }}
        >
           <Ionicons name="notifications-outline" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 0,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  greetingText: {
    color: Colors.dark.icon,
    fontSize: 14,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  pointsText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  notificationBtn: {
     padding: 8,
     alignItems: 'center',
     justifyContent: 'center',
  }
});
