import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { EXERCISES, Exercise } from '@/constants/exercises';
import { useGymXStore, WeekDay } from '@/store/useStore';
import { format } from 'date-fns';
import { SectionHeader } from './SectionHeader';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export const TodaysPlanCards = () => {
  const weeklyPlan = useGymXStore((state) => state.weeklyPlan);
  const today = format(new Date(), 'EEEE') as WeekDay;
  const todayFocus = weeklyPlan[today] || [];
  const router = useRouter();
  
  const { theme, isDark } = useAppTheme();
  
  const isRestDay = todayFocus.length === 0;

  // Flatten the exercises from today's focused categories
  const todaysExercises: Exercise[] = [];
  if (!isRestDay) {
    todayFocus.forEach((category) => {
      if (EXERCISES[category]) {
         todaysExercises.push(...EXERCISES[category]);
      }
    });
  }

  const renderExercise = ({ item, index }: { item: Exercise, index: number }) => {
    // Find category for the current exercise from today's focus
    const category = todayFocus.find(cat => EXERCISES[cat]?.some(ex => ex.id === item.id)) || 'Workout';
    const isLast = index === todaysExercises.length - 1;

    return (
      <View style={styles.stepWrapper}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.stepContainer}
          onPress={() => router.push({ 
            pathname: '/exercise-detail/[id]', 
            params: { id: item.id, name: item.name, image: item.image } 
          })}
        >
          <View style={styles.circleWrapper}>
            {/* The Gradient Story Ring */}
            <LinearGradient 
              colors={[theme.tint, '#8B5CF6']} 
              style={styles.ring} 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            />
            {/* The Image inside the ring */}
            <View style={[styles.imageContainer, { borderColor: theme.background }]}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.image} 
                contentFit="cover"
                transition={300}
                cachePolicy="memory-disk"
              />
            </View>
            {/* Floating Play Badge */}
            <View style={[styles.playBadge, { backgroundColor: theme.text, borderColor: theme.background }]}>
               <Ionicons name="play" size={10} color={theme.background} style={{ marginLeft: 2 }} />
            </View>
          </View>
          
          <Text style={[styles.stepName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.stepCategory, { color: theme.icon }]}>
            {category}
          </Text>
        </TouchableOpacity>

        {/* The connecting path line */}
        {!isLast && (
          <View style={[styles.connector, { backgroundColor: theme.border }]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader 
        title="Today's Journey" 
        actionText={isRestDay ? "" : `${todaysExercises.length} Steps`} 
      />
      
      {isRestDay ? (
        <View style={[styles.restContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
             <Ionicons name="cafe-outline" size={32} color={theme.tint} style={{ marginBottom: 12 }} />
             <Text style={[styles.restTitle, { color: theme.text }]}>Recovery Day</Text>
             <Text style={[styles.restSub, { color: theme.icon }]}>No exercises scheduled. Rest, hydrate, and prepare for tomorrow.</Text>
        </View>
      ) : (
        <FlatList
          data={todaysExercises}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderExercise}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepContainer: {
    width: 90,
    alignItems: 'center',
  },
  circleWrapper: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  imageContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  stepName: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  stepCategory: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  connector: {
    width: 25,
    height: 2,
    marginTop: 44, // Half of circle height (90/2) minus half of line height
    borderRadius: 1,
  },
  restContainer: {
    marginHorizontal: 24,
    padding: 30,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  restTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  restSub: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  }
});
