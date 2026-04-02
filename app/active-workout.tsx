import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width } = Dimensions.get('window');

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const { exerciseId, name } = useLocalSearchParams();
  const activeWorkout = useGymXStore((state) => state.activeWorkout);
  const addSet = useGymXStore((state) => state.addSetToExercise);
  const finishWorkout = useGymXStore((state) => state.finishWorkout);
  const addExercise = useGymXStore((state) => state.addExerciseToWorkout);
  const { theme, isDark } = useAppTheme();

  const [weight, setWeight] = useState('60');
  const [reps, setReps] = useState('12');
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Initialize exercise if not present
  useEffect(() => {
    if (activeWorkout && exerciseId && name) {
      addExercise(exerciseId as string, name as string);
    }
  }, []);

  // Workout Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
             setIsResting(false);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustValue = (type: 'weight' | 'reps', amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'weight') {
      const current = parseFloat(weight) || 0;
      setWeight(Math.max(0, current + amount).toString());
    } else {
      const current = parseInt(reps) || 0;
      setReps(Math.max(0, current + amount).toString());
    }
  };

  const handleAddSet = () => {
    if (weight && reps) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addSet(exerciseId as string, parseFloat(weight), parseInt(reps));
      
      // Start 60s Rest Timer
      setRestTimer(60);
      setIsResting(true);
    }
  };

  const activeExercise = activeWorkout?.exercises.find(e => e.id === exerciseId);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: theme.border }]}>
            <Ionicons name="close" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={[styles.timerContainer, { backgroundColor: `${theme.tint}15`, borderColor: `${theme.tint}40` }]}>
             <Ionicons name="time" size={18} color={theme.tint} />
             <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(timer)}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              finishWorkout();
              router.replace('/(tabs)');
            }} 
            style={[styles.finishBtn, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.8)' }]}
          >
            <Text style={[styles.finishBtnText, { color: isDark ? '#10B981' : '#FFF' }]}>Finish</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInUp} style={styles.titleSection}>
            <Text style={[styles.exerciseName, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.subtitle, { color: theme.icon }]}>Track your performance</Text>
          </Animated.View>

          <View style={[styles.inputCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.icon }]}>Weight</Text>
                <View style={styles.stepperContainer}>
                   <TouchableOpacity onPress={() => adjustValue('weight', -2.5)} style={[styles.stepperBtn, { backgroundColor: theme.background }]}>
                      <Ionicons name="remove" size={18} color={theme.text} />
                   </TouchableOpacity>
                   <TextInput
                     style={[styles.input, { color: theme.text }]}
                     value={weight}
                     onChangeText={setWeight}
                     keyboardType="numeric"
                   />
                   <TouchableOpacity onPress={() => adjustValue('weight', 2.5)} style={[styles.stepperBtn, { backgroundColor: theme.background }]}>
                      <Ionicons name="add" size={18} color={theme.text} />
                   </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.icon }]}>Reps</Text>
                <View style={styles.stepperContainer}>
                   <TouchableOpacity onPress={() => adjustValue('reps', -1)} style={[styles.stepperBtn, { backgroundColor: theme.background }]}>
                      <Ionicons name="remove" size={18} color={theme.text} />
                   </TouchableOpacity>
                   <TextInput
                     style={[styles.input, { color: theme.text }]}
                     value={reps}
                     onChangeText={setReps}
                     keyboardType="numeric"
                   />
                   <TouchableOpacity onPress={() => adjustValue('reps', 1)} style={[styles.stepperBtn, { backgroundColor: theme.background }]}>
                      <Ionicons name="add" size={18} color={theme.text} />
                   </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Rest Timer Overlay */}
            {isResting && (
              <Animated.View entering={FadeInUp} style={[styles.restOverlay, { backgroundColor: theme.card }]}>
                 <View style={styles.restHeader}>
                    <Text style={[styles.restTimerLabel, { color: theme.icon }]}>Rest Time Remaining</Text>
                    <Text style={[styles.restTimerValue, { color: theme.tint }]}>{restTimer}s</Text>
                 </View>
                 <TouchableOpacity onPress={() => setIsResting(false)} style={styles.skipBtn}>
                    <Text style={[styles.skipText, { color: theme.icon }]}>Skip Rest</Text>
                 </TouchableOpacity>
              </Animated.View>
            )}
            
            <TouchableOpacity style={styles.addSetBtn} onPress={handleAddSet}>
              <LinearGradient
                colors={[theme.tint, '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addSetGradient}
              >
                <Text style={styles.addSetText}>Log Set</Text>
                <Ionicons name="add" size={18} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
               <Text style={[styles.historyTitle, { color: theme.text }]}>Set History</Text>
               <Text style={[styles.historyCount, { color: theme.tint }]}>{activeExercise?.sets.length || 0} Sets</Text>
            </View>
            
            {(activeExercise?.sets || []).length > 0 ? (
               activeExercise?.sets.slice().reverse().map((set, idx) => (
                 <Animated.View 
                   key={set.id} 
                   entering={FadeInDown} 
                   layout={Layout.springify()}
                   style={[styles.setRow, { backgroundColor: theme.card, borderColor: theme.border }]}
                 >
                   <View style={[styles.setNumber, { backgroundColor: theme.border }]}>
                      <Text style={[styles.setNumberText, { color: theme.icon }]}>{activeExercise!.sets.length - idx}</Text>
                   </View>
                   <View style={styles.setData}>
                      <Text style={[styles.setValue, { color: theme.text }]}>{set.weight} kg</Text>
                      <Text style={[styles.setLabel, { color: theme.icon }]}>Weight</Text>
                   </View>
                   <View style={styles.setData}>
                      <Text style={[styles.setValue, { color: theme.text }]}>{set.reps}</Text>
                      <Text style={[styles.setLabel, { color: theme.icon }]}>Reps</Text>
                   </View>
                   <TouchableOpacity style={styles.checkBtn}>
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                   </TouchableOpacity>
                 </Animated.View>
               ))
            ) : (
               <View style={styles.emptyState}>
                 <Ionicons name="list-outline" size={48} color={theme.border} />
                 <Text style={[styles.emptyText, { color: theme.icon }]}>No sets logged yet</Text>
               </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
    fontVariant: ['tabular-nums'],
  },
  finishBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  finishBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  inputCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 28,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    height: 48,
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    padding: 0,
  },
  restOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  restHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  restTimerLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  restTimerValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  addSetBtn: {
    width: 200,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
  },
  addSetGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 6,
  },
  historySection: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  historyCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  setNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  setNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  setData: {
    flex: 1,
  },
  setValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  setLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  checkBtn: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
  }
});
