import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { Exercise } from '@/constants/exercises';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

export const ExerciseCard = ({ item }: { item: Exercise }) => {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card, 
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.cardPressed
      ]}
      onPress={() => router.push({ 
        pathname: '/exercise-detail/[id]', 
        params: { id: item.id, name: item.name, image: item.image } 
      })}
    >


      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
        transition={500}
      />
      <LinearGradient
        colors={['transparent', isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(0, 0, 0, 0.6)']}
        style={styles.gradient}
      >
         <View style={styles.content}>
           <View style={styles.topRow}>
             <View style={[styles.difficultyBadge, { backgroundColor: theme.tint }]}>
               <Text style={styles.difficultyText}>Intermediate</Text>
             </View>
             <View style={styles.timeBadge}>
               <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
               <Text style={styles.timeText}>10 min</Text>
             </View>
           </View>
           
           <Text style={[styles.exerciseName, { color: '#FFF' }]}>{item.name}</Text>
           
           <View style={styles.bottomRow}>
             <View style={styles.statContainer}>
               <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.6)' }]}>Muscle</Text>
               <Text style={[styles.statValue, { color: '#FFF' }]}>Bodyweight</Text>
             </View>
             <View style={styles.btnContainer}>
               <View style={[styles.playBtn, { backgroundColor: theme.tint, shadowColor: theme.tint }]}>
                 <Ionicons name="play" size={14} color="#FFF" />
               </View>
             </View>
           </View>
         </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 180,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
  },
  content: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statContainer: {
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  btnContainer: {
    justifyContent: 'center',
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  }
});
