import { Platform } from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

class HealthService {
  private isIOS = Platform.OS === 'ios';
  private isAndroid = Platform.OS === 'android';

  async authorize(): Promise<boolean> {
    try {
      if (this.isIOS) {
        return new Promise((resolve) => {
          const permissions: HealthKitPermissions = {
            permissions: {
              read: [AppleHealthKit.Constants.Permissions.Steps],
              write: [],
            },
          };
          AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) resolve(false);
            else resolve(true);
          });
        });
      }

      if (this.isAndroid) {
        try {
          const isInitialized = await initialize();
          if (!isInitialized) {
            console.warn('[HealthService] Health Connect not initialized. It may not be installed.');
            return false;
          }
          
          await requestPermission([
            { accessType: 'read', recordType: 'Steps' },
          ]);
          return true;
        } catch (e) {
          console.error('[HealthService] Android Init Error:', e);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('[HealthService] Authorization error:', error);
      return false;
    }
  }

  async getTodaySteps(): Promise<number> {
    try {
      if (this.isIOS) {
        return new Promise((resolve) => {
          const options = {
            date: new Date().toISOString(),
            includeManuallyAdded: true,
          };
          AppleHealthKit.getStepCount(options, (err, results) => {
            if (err) resolve(0);
            else resolve(results.value);
          });
        });
      }

      if (this.isAndroid) {
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

        return result.records.reduce((sum, record) => sum + record.count, 0);
      }

      return 0;
    } catch (error) {
      console.error('[HealthService] Error fetching steps:', error);
      return 0;
    }
  }
}

export default new HealthService();
