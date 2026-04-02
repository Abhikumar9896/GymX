import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useAppTheme } from '@/hooks/useAppTheme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WorkoutHistoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const workoutHistory = useGymXStore((state) => state.workoutHistory);
  const workout = workoutHistory.find((w) => w.id === id);
  const { theme, isDark } = useAppTheme();

  if (!workout) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Workout not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.tint }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate session volume
  const totalVolume = workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.reduce((sAcc: number, s: any) => sAcc + (s.weight * s.reps), 0), 0
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Hero Section */}
        <View style={styles.heroWrapper}>
           <LinearGradient 
             colors={[theme.tint, '#4F46E5']} 
             style={styles.heroGradient}
           >
              <SafeAreaView edges={['top']}>
                <View style={styles.headerNav}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.heroType}>COMPLETED SESSION</Text>
                  <View style={{ width: 40 }} />
                </View>

                <View style={styles.heroContent}>
                   <Animated.Text entering={FadeInUp.delay(100)} style={styles.heroName}>{workout.name}</Animated.Text>
                   <Animated.Text entering={FadeInUp.delay(200)} style={styles.heroDate}>
                      {format(new Date(workout.date || Date.now()), 'EEEE • MMM dd, yyyy')}
                   </Animated.Text>
                </View>

                <View style={styles.heroStats}>
                   <View style={styles.heroStatItem}>
                      <Text style={styles.heroStatValue}>{Math.floor(workout.duration / 60)}</Text>
                      <Text style={styles.heroStatLabel}>MINS</Text>
                   </View>
                   <View style={styles.heroStatDivider} />
                   <View style={styles.heroStatItem}>
                      <Text style={styles.heroStatValue}>{workout.calories}</Text>
                      <Text style={styles.heroStatLabel}>KCAL</Text>
                   </View>
                   <View style={styles.heroStatDivider} />
                   <View style={styles.heroStatItem}>
                      <Text style={styles.heroStatValue}>{totalVolume}</Text>
                      <Text style={styles.heroStatLabel}>VOLUME</Text>
                   </View>
                </View>
              </SafeAreaView>
           </LinearGradient>
        </View>

        {/* Exercises List */}
        <View style={styles.contentBody}>
           <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercises</Text>
              <View style={[styles.badge, { backgroundColor: `${theme.tint}15` }]}>
                 <Text style={[styles.badgeText, { color: theme.tint }]}>{workout.exercises.length} Total</Text>
              </View>
           </View>

           {workout.exercises.map((ex, index) => {
              const exVolume = ex.sets.reduce((acc: number, s: any) => acc + (s.weight * s.reps), 0);
              return (
                <Animated.View 
                  key={ex.id + index} 
                  entering={FadeInDown.delay(300 + index * 100)}
                  style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                   <View style={styles.exHeader}>
                      <View style={[styles.exIconContainer, { backgroundColor: `${theme.tint}10`, borderColor: `${theme.tint}20` }]}>
                         <Ionicons name="barbell" size={20} color={theme.tint} />
                      </View>
                      <View style={styles.exTitleContainer}>
                         <Text style={[styles.exTitle, { color: theme.text }]}>{ex.name}</Text>
                         <Text style={[styles.exSubtitle, { color: theme.icon }]}>Vol: {exVolume} kg</Text>
                      </View>
                      <View style={styles.setsCount}>
                         <Text style={[styles.setsCountText, { color: theme.text }]}>{ex.sets.length} sets</Text>
                      </View>
                   </View>

                   <View style={[styles.setsTable, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }]}>
                      <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
                         <Text style={[styles.tableHeadText, { flex: 0.8, color: theme.icon }]}>SET</Text>
                         <Text style={[styles.tableHeadText, { flex: 2, color: theme.icon }]}>WEIGHT</Text>
                         <Text style={[styles.tableHeadText, { flex: 2, color: theme.icon }]}>REPS</Text>
                      </View>
                      {ex.sets.map((set, sIdx) => (
                        <View key={set.id || sIdx} style={styles.tableRow}>
                           <View style={[styles.setCircle, { backgroundColor: theme.border }]}>
                              <Text style={[styles.setNum, { color: theme.icon }]}>{sIdx + 1}</Text>
                           </View>
                           <Text style={[styles.setVal, { flex: 2, color: theme.text }]}>{set.weight} kg</Text>
                           <Text style={[styles.setVal, { flex: 2, color: theme.text }]}>{set.reps}</Text>
                        </View>
                      ))}
                   </View>
                </Animated.View>
              );
           })}
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
           <LinearGradient colors={[theme.tint, '#1D4ED8']} style={styles.homeBtnGradient}>
              <Text style={styles.homeBtnText}>Back to Dashboard</Text>
           </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  heroWrapper: { height: height * 0.44, width: width },
  heroGradient: { flex: 1, paddingHorizontal: 16, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 4 },
  backBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  heroType: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  shareBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroContent: { marginTop: 25, alignItems: 'center', paddingHorizontal: 20 },
  heroName: { color: '#FFF', fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  heroDate: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginTop: 6 },
  heroStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 22, paddingVertical: 14, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  heroStatItem: { alignItems: 'center', flex: 1 },
  heroStatValue: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  heroStatLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: '800', marginTop: 2, textTransform: 'uppercase' },
  heroStatDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.15)' },
  contentBody: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  exerciseCard: { borderRadius: 24, padding: 14, marginBottom: 14, borderWidth: 1 },
  exHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  exIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  exTitleContainer: { flex: 1, marginLeft: 12 },
  exTitle: { fontSize: 14.5, fontWeight: '800' },
  exSubtitle: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  setsCount: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  setsCountText: { fontSize: 10, fontWeight: '800' },
  setsTable: { borderRadius: 18, padding: 10 },
  tableHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, marginBottom: 6 },
  tableHeadText: { fontSize: 9, fontWeight: '800', textAlign: 'center' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, alignItems: 'center' },
  setCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  setNum: { fontSize: 10, fontWeight: '800' },
  setVal: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  homeBtn: { marginHorizontal: 30, marginTop: 20, height: 60, borderRadius: 20, overflow: 'hidden' },
  homeBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' }
});
