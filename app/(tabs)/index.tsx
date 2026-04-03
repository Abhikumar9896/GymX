import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Dimensions, Modal, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { DashboardHeader } from '@/components/gymx/DashboardHeader';
import { ActivityRingsCard } from '@/components/gymx/ActivityRingsCard';
import { TodaysPlanCards } from '@/components/gymx/TodaysPlanCards';
import { CategoryCard } from '@/components/gymx/CategoryCard';
import { SectionHeader } from '@/components/gymx/SectionHeader';
import { CATEGORIES } from '@/constants/exercises';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotifications } from '@/hooks/useNotifications';
import { useGymXStore, WeekDay } from '@/store/useStore';
import { format } from 'date-fns';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  useNotifications();
  const weeklyPlan = useGymXStore((state) => state.weeklyPlan);
  const lastShown = useGymXStore((state) => state.lastModalShown);
  const setLastShown = useGymXStore((state) => state.setLastModalShown);

  const { theme, colorScheme } = useAppTheme();
  const [showGoalModal, setShowGoalModal] = React.useState(false);

  React.useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (lastShown !== todayStr) {
      setShowGoalModal(true);
      setLastShown(todayStr);
    }
  }, []);

  const today = format(new Date(), 'EEEE') as WeekDay;
  const todayFocus = weeklyPlan[today] || [];
  const focusText = todayFocus.length > 0 ? todayFocus.join(' & ') : 'Rest Day';

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View entering={FadeInUp.delay(500).duration(800)}>
      <CategoryCard item={item} />
    </Animated.View>
  );

  const ListHeader = () => (
    <View style={styles.headerSpacer}>
      <DashboardHeader />
      <ActivityRingsCard />
      <TodaysPlanCards />
      <View style={{ marginTop: 20 }}>
        <SectionHeader title="Explore the Gym" actionText="More" />
      </View>
    </View>
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
        />
      </SafeAreaView>

      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
           <Animated.View entering={FadeInUp} style={styles.modalContent}>
              <LinearGradient
                colors={colorScheme === 'dark' ? ['#1E293B', '#0F172A'] : [theme.card, theme.background]}
                style={[styles.modalGradient, { borderColor: theme.border, borderWidth: 1 }]}
              >
                <View style={styles.modalIconBg}>
                   <Ionicons name="fitness" size={40} color="#3B82F6" />
                </View>
                <Text style={[styles.modalTitle, { color: theme.icon }]}>Today's Focus</Text>
                <Text style={[styles.modalDay, { color: theme.text }]}>{today}</Text>
                
                <View style={styles.focusLabelContainer}>
                   <Text style={styles.focusValue}>{focusText}</Text>
                </View>
                
                <Text style={[styles.modalQuote, { color: theme.icon }]}>"The only bad workout is the one that didn't happen."</Text>
                
                <TouchableOpacity 
                  style={styles.modalBtn} 
                  onPress={() => setShowGoalModal(false)}
                >
                  <LinearGradient 
                    colors={['#3B82F6', '#2563EB']} 
                    style={styles.modalBtnGradient}
                  >
                    <Text style={styles.modalBtnText}>Let's Smash It!</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
           </Animated.View>

        </View>
      </Modal>
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
  headerSpacer: {
    marginBottom: 5,
  },
  listContent: {
    paddingBottom: 120,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalContent: {
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 40,
    alignItems: 'center',
  },
  modalIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  modalDay: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 24,
  },
  focusLabelContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 32,
  },
  focusValue: {
    color: '#3B82F6',
    fontSize: 24,
    fontWeight: '900',
  },
  modalQuote: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  modalBtn: {
    width: 220,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  modalBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  }
});
