import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { useGymXStore } from '@/store/useStore';
import { useDailySteps } from '@/hooks/useDailySteps';
import { useAppTheme } from '@/hooks/useAppTheme';
import { format } from 'date-fns';

const RING_RADIUS_STEP = 18;
const STROKE_WIDTH = 12;
const CENTER = 80; // Assuming SVG size 160x160

interface RingData {
  title: string;
  current: number;
  goal: number;
  color: string;
  unit: string;
}

const CircularProgress = ({ rings }: { rings: RingData[] }) => {
  return (
    <View style={styles.svgContainer}>
      <Svg width={CENTER * 2} height={CENTER * 2} viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}>
        <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
          {rings.map((ring, index) => {
            const radius = CENTER - (STROKE_WIDTH / 2) - (index * RING_RADIUS_STEP);
            const circumference = 2 * Math.PI * radius;
            const progress = Math.min(ring.current / (ring.goal || 1), 1);
            const strokeDashoffset = circumference - (progress * circumference);

            return (
              <React.Fragment key={`ring-${index}`}>
                {/* Background Track */}
                <Circle
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeOpacity={0.2}
                  fill="transparent"
                />
                {/* Progress Ring */}
                <Circle
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                />
              </React.Fragment>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export const ActivityRingsCard = () => {
  const workoutHistory = useGymXStore((state) => state.workoutHistory);
  const waterGoal = useGymXStore((state) => state.waterGoal);
  const intakeHistory = useGymXStore((state) => state.waterIntakeHistory);
  const { steps } = useDailySteps();

  const { theme, colorScheme } = useAppTheme();

  const todayStrDate = new Date().toISOString().split('T')[0];
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Calculate Today's Stats
  const todayWorkouts = workoutHistory.filter(w => {
    const workoutDate = w.date.split('T')[0];
    return workoutDate === todayStr || workoutDate === todayStrDate;
  });
  
  const todayTrainingTasks = todayWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
  const todayCalories = todayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const todayWater = intakeHistory.find(l => l.date === todayStrDate || l.date === todayStr)?.amount || 0;

  const trainingGoal = 5; 
  const calorieGoal = 500;
  const stepGoal = 10000;

  const rings: RingData[] = [
    { title: 'TRAINING', current: todayTrainingTasks, goal: trainingGoal, color: '#A855F7', unit: 'Tasks' }, // Purple
    { title: 'CALORIES', current: todayCalories, goal: calorieGoal, color: '#F97316', unit: 'kcal' }, // Orange
    { title: 'STEPS', current: steps, goal: stepGoal, color: '#10B981', unit: 'steps' }, // Green
    { title: 'WATER', current: todayWater, goal: waterGoal, color: '#06B6D4', unit: 'ml' }, // Cyan
  ];

  const totalRingsProgress = rings.reduce((acc, ring) => acc + Math.min(ring.current / (ring.goal || 1), 1), 0);
  const overallProgress = Math.round((totalRingsProgress / rings.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.overallProgressHeader}>
        <Text style={[styles.overallProgressText, { color: theme.icon }]}>Overall: {overallProgress}% complete</Text>
      </View>
      <View style={styles.content}>
        {/* Left Side: Stats Text */}
        <View style={styles.statsContainer}>
          {rings.map((ring, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={[styles.statTitle, { color: theme.text }]}>{ring.title}</Text>
              <Text style={styles.statValue}>
                <Text style={[styles.currentValue, { color: ring.color }]}>{ring.current}</Text>
                <Text style={[styles.goalValue, { color: theme.icon }]}> / {ring.goal} {ring.unit}</Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Right Side: Concentric Rings */}
        <CircularProgress rings={rings} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statItem: {
    marginBottom: 16,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  overallProgressHeader: {
    marginBottom: 5,
  },
  overallProgressText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statValue: {
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  goalValue: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '700',
  },
  svgContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  }
});
