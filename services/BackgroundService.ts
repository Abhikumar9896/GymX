import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import HealthService from './HealthService';
import { useGymXStore } from '@/store/useStore';

const BACKGROUND_FETCH_TASK = 'BACKGROUND_STEP_SYNC';

// 1. Define the task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('[BackgroundService] Background fetch at:', new Date());

    // Fetch the latest count from the system (even if app is closed/killed)
    const steps = await HealthService.getTodaySteps();
    
    // Note: If the app is killed, we need to make sure we store it correctly.
    // In many cases, it might be easier to just rely on HealthService.getTodaySteps() 
    // when the app opens. However, if we want notifications or some calculations, 
    // we can update storage or send a notification here.
    
    if (steps > 0) {
       console.log(`[BackgroundService] Sync successful. Today's Steps: ${steps}`);
       // Update logic could be added here if needed (e.g., local state persistence)
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[BackgroundService] Sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// 2. Class for registration
class BackgroundService {
  async register() {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60, // 15 mins (minimum for iOS/Android)
          stopOnTerminate: false, // Continue even after kill
          startOnBoot: true, // Resume after phone restart
        });
        console.log('[BackgroundService] Registered successfully');
      }
    } catch (error) {
      console.error('[BackgroundService] Error during registration:', error);
    }
  }

  async unregister() {
    if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
  }
}

export default new BackgroundService();
