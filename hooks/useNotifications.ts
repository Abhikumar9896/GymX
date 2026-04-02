import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useGymXStore, WeekDay } from '@/store/useStore';
import { format } from 'date-fns';

// Dynamically import notifications to avoid crash on Android Expo Go
let Notifications: any = null;
let SchedulableTriggerInputTypes: any = null;

const isExpoGo = Constants.appOwnership === 'expo';
let shouldEnableNotifications = Platform.OS !== 'android' || !isExpoGo;

if (shouldEnableNotifications) {
  try {
    Notifications = require('expo-notifications');
    // For local notifications, some parts of expo-notifications might still work
    // BUT in SDK 55, it's safer to avoid it if it triggers that error.
    if (Notifications) {
      SchedulableTriggerInputTypes = Notifications.SchedulableTriggerInputTypes;
      
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  } catch (e) {
    console.warn('Failed to initialize expo-notifications:', e);
    shouldEnableNotifications = false;
  }
}

export function useNotifications() {
  const weeklyPlan = useGymXStore((state) => state.weeklyPlan);
  const notificationTime = useGymXStore((state) => state.notificationTime);

  useEffect(() => {
    let isMounted = true;

    async function setupNotifications() {
      if (!Notifications || !shouldEnableNotifications) return;

      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission && isMounted) {
        await scheduleDailyNotifications();
      }
    }


    setupNotifications();
    return () => { isMounted = false; };
  }, [weeklyPlan, notificationTime]);

  const scheduleDailyNotifications = async () => {
    if (!Notifications) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      // 1. Schedule Workout Notifications for each day of the week
      const weekDays: WeekDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      for (let i = 0; i < 7; i++) {
        const dayName = weekDays[i];
        const focus = weeklyPlan[dayName] || [];
        const focusText = focus.length > 0 ? focus.join(' & ') : 'Rest Day';

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "GymX Workout Plan 🔥",
            body: focus.length > 0 
                  ? `Hey! Today is ${focusText} day. Let's smash those goals!` 
                  : `Hey! It's a Rest Day today. Recover well and hydrate!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority?.HIGH,
          },
          trigger: {
            type: SchedulableTriggerInputTypes?.CALENDAR,
            weekday: i + 1, // 1 = Sunday, 2 = Monday, 3 = Tuesday, ...
            hour: notificationTime?.hour || 8,
            minute: notificationTime?.minute || 0,
            repeats: true,
          },
        });
      }

      // 2. Schedule Water Reminders every 1.5 hours from 9 AM to 7:30 PM
      const waterReminders = [
        { hour: 9, minute: 0, title: 'Morning Hydration 💧', body: "Start your day right with a glass of water to boost metabolism!" },
        { hour: 10, minute: 30, title: 'Stay Hydrated! 🌊', body: "It's been 1.5 hours. Time for another glass of water." },
        { hour: 12, minute: 0, title: 'Mid-Day Hydration 💧', body: "Keep your body fueled. Drink some water before lunch." },
        { hour: 13, minute: 30, title: 'Afternoon Refuel 🌊', body: "Time to hydrate! Keep your energy up for your workout." },
        { hour: 15, minute: 0, title: 'Water Break! 💧', body: "Don't forget to drink water. Consistency is key!" },
        { hour: 16, minute: 30, title: 'Stay Hydrated! 🌊', body: "Another 1.5 hours down. Grab a glass of water." },
        { hour: 18, minute: 0, title: 'Evening Recovery 💧', body: "Finish your day strong. Have some water." },
        { hour: 19, minute: 30, title: 'Night Hydration 🌊', body: "One last glass of water before winding down for the night." },
      ];

      for (const reminder of waterReminders) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: reminder.body,
            sound: true,
          },
          trigger: {
            type: SchedulableTriggerInputTypes?.CALENDAR,
            hour: reminder.hour,
            minute: reminder.minute,
            repeats: true,
          },
        });
      }

    } catch (e) {
      console.log('Error scheduling notifications:', e);
    }
  };
}


async function registerForPushNotificationsAsync() {
  if (!Notifications) return false;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance?.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (e) {
    console.log('Error getting notification permissions:', e);
    return false;
  }
}
