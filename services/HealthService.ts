import { Platform } from 'react-native';

// react-native-health is iOS ONLY — never import on Android or it will crash
let AppleHealthKit: any = null;
if (Platform.OS === 'ios') {
  AppleHealthKit = require('react-native-health').default;
}

// Health Connect (Android only)
let healthConnectModule: any = null;
if (Platform.OS === 'android') {
  healthConnectModule = require('react-native-health-connect');
}

class HealthService {
  private isIOS = Platform.OS === 'ios';
  private isAndroid = Platform.OS === 'android';

  async authorize(): Promise<boolean> {
    try {
      if (this.isIOS) {
        if (!AppleHealthKit) return false;
        return new Promise((resolve) => {
          const permissions = {
            permissions: {
              read: [AppleHealthKit.Constants.Permissions.Steps],
              write: [],
            },
          };
          AppleHealthKit.initHealthKit(permissions, (err: any) => {
            if (err) resolve(false);
            else resolve(true);
          });
        });
      }

      if (this.isAndroid) {
        if (!healthConnectModule) return false;
        try {
          const { initialize, requestPermission } = healthConnectModule;
          // initialize() returns false if Health Connect is not installed — DON'T throw
          const isInitialized = await initialize();
          if (!isInitialized) {
            console.warn('[HealthService] Health Connect not available on this device.');
            return false;
          }
          // requestPermission can throw if Health Connect app is missing/outdated
          await requestPermission([
            { accessType: 'read', recordType: 'Steps' },
          ]);
          return true;
        } catch (e) {
          // Swallow all Health Connect errors — device may not have the app
          console.warn('[HealthService] Android Health Connect unavailable:', e);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.warn('[HealthService] Authorization error (non-fatal):', error);
      return false;
    }
  }

  async getTodaySteps(): Promise<number> {
    try {
      if (this.isIOS) {
        if (!AppleHealthKit) return 0;
        return new Promise((resolve) => {
          const options = {
            date: new Date().toISOString(),
            includeManuallyAdded: true,
          };
          AppleHealthKit.getStepCount(options, (err: any, results: any) => {
            if (err) resolve(0);
            else resolve(results?.value ?? 0);
          });
        });
      }

      if (this.isAndroid) {
        if (!healthConnectModule) return 0;
        const { readRecords } = healthConnectModule;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();

        const result = await readRecords('Steps', {
          timeRangeFilter: {
            operator: 'between',
            startTime: today.toISOString(),
            endTime: now.toISOString(),
          },
        });

        return result.records.reduce((sum: number, record: any) => sum + (record.count ?? 0), 0);
      }

      return 0;
    } catch (error) {
      // Non-fatal: return 0 steps if Health Connect unavailable
      console.warn('[HealthService] Steps fetch failed (non-fatal):', error);
      return 0;
    }
  }
}

export default new HealthService();
