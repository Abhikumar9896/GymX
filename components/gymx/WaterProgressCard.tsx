import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGymXStore } from '@/store/useStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export const WaterProgressCard = () => {
  const router = useRouter();
  const waterGoal = useGymXStore((state) => state.waterGoal);
  const intakeHistory = useGymXStore((state) => state.waterIntakeHistory);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayIntake = intakeHistory.find(l => l.date === todayStr)?.amount || 0;
  const percentage = Math.min((todayIntake / waterGoal) * 100, 100);

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => router.push('/(tabs)/water')}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.6)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="water" size={20} color="#3B82F6" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Hydration Tracker</Text>
            <Text style={styles.subtitle}>{todayIntake}ml of {waterGoal}ml Goal</Text>
          </View>
          <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
        </View>
        
        <View style={styles.progressBarBg}>
           <LinearGradient
             colors={['#3B82F6', '#60A5FA']}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
             style={[styles.progressBarFill, { width: `${percentage}%` }]}
           />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  card: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  percentText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '900',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  }
});
