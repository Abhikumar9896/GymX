import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

export const useDailySteps = () => {
  const [steps, setSteps] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        if (Platform.OS === 'ios') {
          const permissions: HealthKitPermissions = {
            permissions: {
              read: [AppleHealthKit.Constants.Permissions.Steps],
              write: [],
            },
          };

          AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
              setError('Error initializing Apple Health.');
              return;
            }
            setIsAuthorized(true);

            // Fetch today's steps
            const options = {
              date: new Date().toISOString(), // Requires ISO string
              includeManuallyAdded: true,
            };

            AppleHealthKit.getStepCount(options, (fetchErr, results) => {
              if (fetchErr) {
                setError('Error fetching steps.');
                return;
              }
              setSteps(results.value);
            });
          });

        } else if (Platform.OS === 'android') {
          // Initialize Health Connect
          const isInitialized = await initialize();
          if (!isInitialized) {
            setError('Health Connect is not available on this device.');
            return;
          }

          // Request Permissions
          await requestPermission([
            { accessType: 'read', recordType: 'Steps' },
          ]);
          setIsAuthorized(true);

          // Get Today's Date Range
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const result = await readRecords('Steps', {
            timeRangeFilter: {
              operator: 'between',
              startTime: today.toISOString(),
              endTime: new Date().toISOString(),
            },
          });

          // Calculate total
          const totalSteps = result.records.reduce((sum, record) => sum + record.count, 0);
          setSteps(totalSteps);
        }
      } catch (e: any) {
        setError(e.message || 'An error occurred while tracking steps.');
      }
    };

    fetchHealthData();
  }, []);

  return { steps, isAuthorized, error };
};
