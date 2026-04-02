import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGymXStore } from '@/store/useStore';
import { isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const ProgressCards = () => {
  const history = useGymXStore((state) => state.workoutHistory);
  const user = useGymXStore((state) => state.user);
  
  const todayCalories = history
    .filter(w => isSameDay(new Date(w.date), new Date()))
    .reduce((acc, w) => acc + w.calories, 0);

  const todayMinutes = history
    .filter(w => isSameDay(new Date(w.date), new Date()))
    .reduce((acc, w) => acc + Math.floor(w.duration / 60), 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(59, 130, 246, 1)', 'rgba(37, 99, 235, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mainCard, { width: width - 40 }]}
      >
         <View style={styles.mainCardTop}>
           <View>
             <Text style={styles.mainLabel}>Active Calories</Text>
             <Text style={styles.mainValue}>{todayCalories} kcal</Text>
           </View>
           <View style={styles.iconContainer}>
             <Ionicons name="flame" size={24} color="#FFF" />
           </View>
         </View>
         <View style={styles.progressBarBg}>
           <View style={[styles.progressBarFill, { width: '65%' }]} />
         </View>
         <Text style={styles.mainSubtext}>65% of daily goal reached</Text>
      </LinearGradient>

      <View style={styles.row}>
        <View style={styles.smallCard}>
           <View style={[styles.smallIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
             <Ionicons name="time" size={20} color="#34D399" />
           </View>
           <Text style={styles.smallLabel}>Time</Text>
           <Text style={styles.smallValue}>{todayMinutes}m</Text>
        </View>
         <View style={styles.smallCard}>
            <View style={[styles.smallIconWrapper, { backgroundColor: 'rgba(57, 255, 20, 0.1)' }]}>
              <Ionicons name="barbell" size={20} color="#34D399" />
            </View>
            <Text style={styles.smallLabel}>Workouts</Text>
            <Text style={styles.smallValue}>{history.length}</Text>
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mainCard: {
    padding: 24,
    borderRadius: 28,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  mainCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mainLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  mainSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  smallIconWrapper: {
    padding: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  smallLabel: {
    color: Colors.dark.icon,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  smallValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  }
});
