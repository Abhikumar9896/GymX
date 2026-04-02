import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, createAnimatedComponent } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useGymXStore } from '@/store/useStore';
import { EXERCISES } from '@/constants/exercises';

const AnimatedImage = createAnimatedComponent(Image);

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.52;

export default function ExerciseDetailScreen() {
  const { id, name, image } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const scrollY = useSharedValue(0);
  
  const activeWorkout = useGymXStore((state) => state.activeWorkout);
  const startWorkout = useGymXStore((state) => state.startWorkout);

  const onStartExercise = () => {
    if (!activeWorkout) {
      startWorkout(`${name} Session`);
    }
    router.push({
      pathname: '/active-workout',
      params: { exerciseId: id, name, image }
    });
  };


  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [-100, 0],
        [HEADER_HEIGHT + 100, HEADER_HEIGHT],
        'extend'
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT / 2],
            'clamp'
          ),
        },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.2, 1], 'clamp'),
        },
      ],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.detailsContainer, { backgroundColor: theme.background }]}>
           <View style={[styles.indicator, { backgroundColor: theme.border }]} />
           
           <View style={styles.titleRow}>
             <View>
               <Text style={[styles.categoryLabel, { color: theme.tint }]}>EXERCISE DETAILS</Text>
               <Text style={[styles.title, { color: theme.text }]}>{name}</Text>
             </View>
           </View>

           <View style={[styles.statsRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.statBox}>
                 <Text style={[styles.statValue, { color: theme.text }]}>3</Text>
                 <Text style={[styles.statLabel, { color: theme.icon }]}>Sets</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                 <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
                 <Text style={[styles.statLabel, { color: theme.icon }]}>Reps</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                 <Text style={[styles.statValue, { color: theme.text }]}>60s</Text>
                 <Text style={[styles.statLabel, { color: theme.icon }]}>Rest</Text>
              </View>
           </View>

           <View style={styles.section}>
             <Text style={[styles.sectionTitle, { color: theme.text }]}>Instructions</Text>
             {(EXERCISES['Chest']?.find(e => e.id === id)?.instructions || [
               'Lay flat on the bench with your feet firmly on the ground.',
               'Grip the weights securely with a medium-wide grip.',
               'Lower the weights slowly to your mid-chest level.',
               'Push back up until your arms are fully extended.',
               'Breathe out as you push and in as you lower.'
             ]).map((step, index) => (
               <View key={index} style={styles.stepRow}>
                 <View style={[styles.stepNumber, { backgroundColor: `${theme.tint}15` }]}>
                   <Text style={[styles.stepNumberText, { color: theme.tint }]}>{index + 1}</Text>
                 </View>
                 <Text style={[styles.stepText, { color: theme.icon }]}>{step}</Text>
               </View>
             ))}
           </View>

           <TouchableOpacity style={styles.startBtn} onPress={onStartExercise}>
             <LinearGradient
               colors={[theme.tint, '#2563EB']}
               style={styles.btnGradient}
             >
               <Text style={styles.startBtnText}>Start Exercise</Text>
               <Ionicons name="arrow-forward" size={16} color="#FFF" />
             </LinearGradient>
           </TouchableOpacity>

        </View>
      </Animated.ScrollView>

      <Animated.View style={[styles.header, headerStyle]}>
        {/* @ts-ignore - contentFit is valid for expo-image but may not be recognized by animated wrap */}
        <AnimatedImage
          source={{ uri: image as string }}
          style={[styles.headerImage, imageStyle]}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.4)', 'transparent', isDark ? 'rgba(15, 23, 42, 1)' : theme.background]}
          style={styles.headerGradient}
        />
      </Animated.View>

      <SafeAreaView style={styles.topActions} edges={['top']}>
         <TouchableOpacity 
           style={styles.backBtn} 
           onPress={() => router.back()}
         >
           <Ionicons name="chevron-back" size={18} color="#FFF" />
         </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: width,
    overflow: 'hidden',
    zIndex: 0,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT - 30,
  },
  detailsContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: height * 0.65,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontWeight: '800',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  startBtn: {
    width: 220,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 20,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 8,
  }
});
