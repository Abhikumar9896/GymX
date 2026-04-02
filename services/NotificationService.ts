import { Platform } from 'react-native';
import Constants from 'expo-constants';

// We use require for lazy loading to avoid crashes in Expo Go SDK 53+
let Notifications: any = null;

export type WeekDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

class NotificationService {
  private isExpoGo = Constants.appOwnership === 'expo';
  private shouldEnable = Platform.OS !== 'android' || !this.isExpoGo;

  constructor() {
    this.init();
  }

  private init() {
    if (this.shouldEnable) {
      try {
        Notifications = require('expo-notifications');
        this.setupHandler();
      } catch (error) {
        console.warn('[NotificationService] Failed to load notifications module:', error);
        this.shouldEnable = false;
      }
    } else {
      console.log('[NotificationService] Notifications are disabled in Android Expo Go (SDK 53+)');
    }
  }

  private setupHandler() {
    if (Notifications) {
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
  }

  async requestPermissions() {
    if (!this.shouldEnable || !Notifications) return false;
    
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
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
    } catch (error) {
      console.error('[NotificationService] Error requesting permissions:', error);
      return false;
    }
  }

  async cancelAll() {
    if (!this.shouldEnable || !Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async scheduleWorkoutNotifications(weeklyPlan: Record<string, string[]>, hour: number, minute: number) {
    if (!this.shouldEnable || !Notifications) return;

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
           priority: Notifications.AndroidNotificationPriority.HIGH,
         },
         trigger: {
           type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
           weekday: i + 1,
           hour: hour,
           minute: minute,
           repeats: true,
         },
       });
    }
  }

  async scheduleWaterReminders() {
    if (!this.shouldEnable || !Notifications) return;

    const waterReminders = [
      { hour: 9, minute: 0, title: 'Morning Hydration 💧', body: "Start your day right with a glass of water to boost metabolism!" },
      { hour: 11, minute: 0, title: 'Stay Hydrated! 🌊', body: "It's time for another glass of water." },
      { hour: 13, minute: 0, title: 'Mid-Day Hydration 💧', body: "Keep your body fueled. Drink some water before lunch." },
      { hour: 15, minute: 0, title: 'Afternoon Refuel 🌊', body: "Time to hydrate! Keep your energy up for your workout." },
      { hour: 17, minute: 0, title: 'Water Break! 💧', body: "Don't forget to drink water. Consistency is key!" },
      { hour: 19, minute: 0, title: 'Evening Recovery 💧', body: "Finish your day strong. Have some water." },
    ];

    for (const reminder of waterReminders) {
       await Notifications.scheduleNotificationAsync({
         content: {
           title: reminder.title,
           body: reminder.body,
           sound: true,
         },
         trigger: {
           type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
           hour: reminder.hour,
           minute: reminder.minute,
           repeats: true,
         },
       });
    }
  }
}

export default new NotificationService();
