import { useState, useEffect, useCallback } from 'react';
import HealthService from '@/services/HealthService';

export const useDailySteps = () => {
  const [steps, setSteps] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = useCallback(async () => {
    try {
      const todaySteps = await HealthService.getTodaySteps();
      setSteps(todaySteps);
    } catch (e: any) {
      console.warn('[useDailySteps] Update failed:', e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let updateInterval: NodeJS.Timeout | null = null;

    const setup = async () => {
      try {
        const authorized = await HealthService.authorize();
        if (!isMounted) return;
        
        setIsAuthorized(authorized);
        if (authorized) {
          await fetchSteps();
          
          // Professional: Set interval to update steps automatically every 30 seconds
          // so the app feels "live" and modern.
          updateInterval = setInterval(fetchSteps, 30000);
        } else {
          setError('Health permissions not granted.');
        }
      } catch (e: any) {
        if (isMounted) setError(e.message || 'Error tracking steps');
      }
    };

    setup();

    return () => { 
      isMounted = false; 
      if (updateInterval) clearInterval(updateInterval);
    };
  }, [fetchSteps]);

  return { steps, isAuthorized, error, refresh: fetchSteps };
};
