import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image'; // High-performance images
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Category } from '@/constants/exercises';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40);

export const CategoryCard = ({ item }: { item: Category }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push({ pathname: '/exercise-list/[category]', params: { category: item.name } })}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
          style={styles.gradient}
        >
           <View style={styles.textContainer}>
             <Text style={styles.categoryName}>{item.name}</Text>
             <Text style={styles.exerciseCount}>15+ Exercises</Text>
           </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    height: 180,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
    padding: 24,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  categoryName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  exerciseCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  }
});
