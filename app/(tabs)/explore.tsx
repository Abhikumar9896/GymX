import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { SectionHeader } from '@/components/gymx/SectionHeader';
import { TrendingCard } from '@/components/gymx/TrendingCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

const TRENDING = [
  { id: '1', title: 'HIIT Intensive', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070', duration: '20 min', calories: '350 kcal' },
  { id: '2', title: 'Power Lifting', image: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=2070', duration: '45 min', calories: '500 kcal' },
  { id: '3', title: 'Extreme Yoga', image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=2070', duration: '30 min', calories: '200 kcal' },
];

const TIPS = [
  { id: '1', title: 'Rest is Progress', description: 'Sleeping 8+ hours is critical for muscle repair.', icon: 'moon' },
  { id: '2', title: 'Hydration 101', description: 'Drink 3-4 liters of water for peak performance.', icon: 'water' },
  { id: '3', title: 'Mind-Muscle', description: 'Focus on the muscle group rather than the weight.', icon: 'bulb' },
];

export default function DiscoverScreen() {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
             <Text style={[styles.headerTitle, { color: theme.text }]}>Discover</Text>
             <Text style={[styles.headerSubtitle, { color: theme.icon }]}>Find your next challenge</Text>
          </View>

          <SectionHeader title="Trending Workouts" actionText="View all" />
          <FlatList 
            data={TRENDING}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TrendingCard {...item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />

          <SectionHeader title="Daily Tips" />
          <View style={styles.tipsContainer}>
            {TIPS.map((tip) => (
              <View key={tip.id} style={[styles.tipCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.tipIcon, { backgroundColor: `${theme.tint}15` }]}>
                  <Ionicons name={tip.icon as any} size={24} color={theme.tint} />
                </View>
                <View style={styles.tipText}>
                  <Text style={[styles.tipTitle, { color: theme.text }]}>{tip.title}</Text>
                  <Text style={[styles.tipDesc, { color: theme.icon }]}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  trendingList: {
    paddingRight: 20,
  },
  tipsContainer: {
    paddingHorizontal: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
  },
  tipIcon: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipText: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  }
});

