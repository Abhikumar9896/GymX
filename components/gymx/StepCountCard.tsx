import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useDailySteps } from '@/hooks/useDailySteps';

const GOAL = 10000;

export const StepCountCard = () => {
  const { steps, isAuthorized, error } = useDailySteps();

  const percentage = Math.min((steps / GOAL) * 100, 100);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.6)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="footsteps" size={20} color="#10B981" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Daily Steps</Text>
            {error ? (
              <Text style={styles.errorText}>Needs Health Permissions ✨</Text>
            ) : (
              <Text style={styles.subtitle}>{steps.toLocaleString()} / {GOAL.toLocaleString()} Steps</Text>
            )}
          </View>
          <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
        </View>

        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={['#10B981', '#34D399']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${percentage}%` }]}
          />
        </View>
      </LinearGradient>
    </View>
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
  errorText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  percentText: {
    color: '#10B981',
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
  },
});
