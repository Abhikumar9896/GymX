import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform } from 'react-native';
import HealthService from './HealthService';


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
    // Background fetch on real Android devices can crash if permissions/services are not ready
    // Wrap everything in try-catch so it NEVER crashes the app
    try {
      // Small delay to ensure app is fully initialized before registering background tasks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60, // 15 minutes
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('[BackgroundService] Registered successfully');
      }
    } catch (error) {
      // Non-fatal: background sync won't run but the app won't crash
      console.warn('[BackgroundService] Registration failed (non-fatal):', error);
    }
  }

  async unregister() {
    try {
      if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)) {
        await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      }
    } catch (error) {
      console.warn('[BackgroundService] Unregister failed (non-fatal):', error);
    }
  }
}

export default new BackgroundService();
