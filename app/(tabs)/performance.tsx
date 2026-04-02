import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useGymXStore } from '@/store/useStore';
import { SectionHeader } from '@/components/gymx/SectionHeader';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, subDays, isSameDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width } = Dimensions.get('window');

export default function PerformanceScreen() {
  const router = useRouter();
  const workoutHistory = useGymXStore((state) => state.workoutHistory);
  const { theme, isDark } = useAppTheme();
  
  // 1. DATA FOR RECOVERY (DAILY ACTIVITY - LAST 7 DAYS)
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
  const dailyCalories = last7Days.map(day => {
    return workoutHistory
      .filter(w => isSameDay(new Date(w.date), day))
      .reduce((acc, w) => acc + w.calories, 0);
  });

  // 2. DATA FOR STRENGTH (WEEKLY VOLUME - LAST 6 WEEKS)
  const last6Weeks = Array.from({ length: 6 }).map((_, i) => {
    return subDays(new Date(), (5 - i) * 7);
  });

  const weeklyVolume = last6Weeks.map((weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const weekWorkouts = workoutHistory.filter((w) => {
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart && workoutDate < weekEnd;
    });

    return weekWorkouts.reduce((totalVol, w) => {
      const workoutVol = w.exercises.reduce((exVol: number, ex: any) => {
        return exVol + ex.sets.reduce((setVol: number, s: any) => setVol + (s.weight * s.reps), 0);
      }, 0);
      return totalVol + workoutVol;
    }, 0);
  });

  const chartConfig = {
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    color: (opacity = 1) => isDark ? `rgba(96, 165, 250, ${opacity})` : `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => theme.icon,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    propsForLabels: { fontSize: 10 }
  };

  const recoveryData = {
    labels: last7Days.map(day => format(day, 'EE')),
    datasets: [{
      data: dailyCalories.length > 0 ? dailyCalories.map(c => Math.max(0, c)) : [0,0,0,0,0,0,0],
    }]
  };

  const strengthData = {
    labels: last6Weeks.map((_, i) => `W${i + 1}`),
    datasets: [{
      data: weeklyVolume.length > 0 ? weeklyVolume.map(v => Math.max(0, v)) : [0, 0, 0, 0, 0, 0],
    }]
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Analytics</Text>
            <Text style={[styles.headerSubtitle, { color: theme.icon }]}>Simple view of your training output</Text>
          </View>

          {/* Quick Stats Overview */}
          <View style={styles.summaryRow}>
             <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="flame" size={16} color="#F59E0B" />
                <Text style={[styles.summaryValue, { color: theme.text }]}>{workoutHistory.length}</Text>
                <Text style={[styles.summaryLabel, { color: theme.icon }]}>Sessions</Text>
             </View>
             <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="timer" size={16} color="#3B82F6" />
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                   {workoutHistory.length > 0 ? Math.round(workoutHistory.reduce((acc, w) => acc + w.duration, 0) / (workoutHistory.length * 60)) : 0}m
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.icon }]}>Avg Time</Text>
             </View>
             <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="flash" size={16} color="#10B981" />
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                   {workoutHistory.reduce((acc, w) => acc + w.calories, 0)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.icon }]}>Total Kcal</Text>
             </View>
          </View>

          {/* CHART 1: RECOVERY (DAILY ACTIVITY) */}
          <SectionHeader title="Recovery & Activity" actionText="Daily Calories" />
          <View style={styles.chartContainer}>
            <BarChart
              data={recoveryData}
              width={width - 30}
              height={180}
              yAxisLabel=""
              yAxisSuffix=" kcal"
              chartConfig={{
                ...chartConfig,
                fillShadowGradient: theme.tint,
                fillShadowGradientOpacity: 1,
              }}
              fromZero
              showBarTops={false}
              withInnerLines={false}
              style={styles.chart}
            />
          </View>

          {/* CHART 2: STRENGTH PROGRESSION */}
          <SectionHeader title="Strength Progress" actionText="Weekly Volume" />
          <View style={styles.metricsGrid}>
             <View style={[styles.muscleCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <LineChart 
                  data={strengthData}
                  width={width - 50}
                  height={180}
                  yAxisSuffix=" kg"
                  chartConfig={{
                     ...chartConfig,
                     backgroundGradientFrom: theme.card,
                     backgroundGradientTo: theme.card,
                     color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                  }}
                  bezier
                  style={{ borderRadius: 16 }}
                />
             </View>
          </View>

          {/* RECENT ACTIVITY LIST */}
          <SectionHeader title="Recent Activity" actionText="Last 5 Sessions" />
          <View style={styles.activityList}>
            {workoutHistory.slice(0, 5).map((workout) => (
              <TouchableOpacity 
                key={workout.id} 
                style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push(`/workout-history/${workout.id}`)}
              >
                 <View style={[styles.activityIcon, { backgroundColor: `${theme.tint}10`, borderColor: `${theme.tint}20` }]}>
                    <Text style={[styles.activityDate, { color: theme.text }]}>{format(new Date(workout.date), 'dd')}</Text>
                    <Text style={[styles.activityMonth, { color: theme.icon }]}>{format(new Date(workout.date), 'MMM')}</Text>
                 </View>
                 <View style={styles.activityInfo}>
                    <Text style={[styles.activityName, { color: theme.text }]} numberOfLines={1}>{workout.name}</Text>
                    <View style={styles.activityMetaRow}>
                       <Text style={[styles.activityStats, { color: theme.icon }]}>{workout.exercises.length} Ex</Text>
                       <View style={[styles.dot, { backgroundColor: theme.border }]} />
                       <Text style={[styles.activityStats, { color: theme.icon }]}>{Math.floor(workout.duration / 60)} min</Text>
                    </View>
                 </View>
                 <View style={[styles.pointsBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FFFBEB' }]}>
                    <Text style={styles.pointsText}>+{workout.exercises.reduce((acc, e) => acc + e.sets.length, 0) * 10} XP</Text>
                 </View>
              </TouchableOpacity>
            ))}
            {workoutHistory.length === 0 && (
               <View style={styles.emptyState}>
                  <Ionicons name="analytics-outline" size={40} color={theme.border} />
                  <Text style={[styles.emptyText, { color: theme.icon }]}>Your journey begins with one workout.</Text>
               </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 160 },
  header: { paddingHorizontal: 20, marginTop: 10, marginBottom: 24 },
  headerTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  headerSubtitle: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  summaryCard: { width: (width - 60) / 3, padding: 12, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },
  summaryValue: { fontSize: 16, fontWeight: '900', marginTop: 2 },
  chartContainer: { paddingHorizontal: 20, marginBottom: 24 },
  chart: { borderRadius: 24, paddingRight: 40, paddingTop: 16, paddingBottom: 12 },
  metricsGrid: { paddingHorizontal: 20, marginBottom: 24 },
  muscleCard: { borderRadius: 24, padding: 12, paddingBottom: 20, alignItems: 'center', borderWidth: 1 },
  activityList: { paddingHorizontal: 20, paddingBottom: 20 },
  activityCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20, marginBottom: 10, borderWidth: 1 },
  activityIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1 },
  activityDate: { fontSize: 16, fontWeight: '900', lineHeight: 18 },
  activityMonth: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  activityMetaRow: { flexDirection: 'row', alignItems: 'center' },
  activityStats: { fontSize: 11, fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 6 },
  pointsBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pointsText: { color: '#F59E0B', fontSize: 11, fontWeight: '900' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { textAlign: 'center', marginTop: 12, fontSize: 13, fontWeight: '600' }
});
