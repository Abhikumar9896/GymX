import { useEffect } from 'react';
import { useGymXStore } from '@/store/useStore';
import NotificationService from '@/services/NotificationService';

export function useNotifications() {
  const weeklyPlan = useGymXStore((state) => state.weeklyPlan);
  const notificationTime = useGymXStore((state) => state.notificationTime);
  const notificationsEnabled = useGymXStore((state) => state.notificationsEnabled);

  useEffect(() => {
    let isMounted = true;

    async function syncNotifications() {
      if (!notificationsEnabled) {
        await NotificationService.cancelAll();
        return;
      }

      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission && isMounted) {
        // Cancel first to avoid duplicates
        await NotificationService.cancelAll();
        
        // Schedule workout reminders
        await NotificationService.scheduleWorkoutNotifications(
          weeklyPlan, 
          notificationTime.hour, 
          notificationTime.minute
        );

        // Schedule water reminders
        await NotificationService.scheduleWaterReminders();
        
        console.log('[useNotifications] Synchronized notifications');
      }
    }

    syncNotifications();
    return () => { isMounted = false; };
  }, [weeklyPlan, notificationTime, notificationsEnabled]);
}
