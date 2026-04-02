import React from 'react';
import { FlatList, StyleSheet, View, StatusBar, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { EXERCISES } from '@/constants/exercises';
import { Colors } from '@/constants/theme';
import { ExerciseCard } from '@/components/gymx/ExerciseCard';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ExerciseListScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const exercises = EXERCISES[category as string] || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
             <ThemedText style={[styles.headerTitle, { color: theme.text }]}>{category}</ThemedText>
             <ThemedText style={[styles.headerSubtitle, { color: theme.icon }]}>{exercises.length} Workouts Available</ThemedText>
          </View>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExerciseCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
               <Ionicons name="fitness-outline" size={64} color={theme.border} />
               <ThemedText style={[styles.emptyText, { color: theme.icon }]}>No exercises found</ThemedText>
            </View>
          )}
        />
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    paddingVertical: 8,
    marginRight: 10,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  }
});
