import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Modal, StatusBar } from 'react-native';
import { useGymXStore, WeekDay } from '@/store/useStore';
import { CATEGORIES } from '@/constants/exercises';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, SlideInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORY_ICONS: Record<string, any> = {
  'Chest': 'fitness-outline',
  'Back': 'layers-outline',
  'Legs': 'walk-outline',
  'Shoulders': 'body-outline',
  'Arms': 'barbell-outline',
  'Cardio': 'heart-outline',
  'Rest Day': 'moon-outline',
};

export default function PlannerScreen() {
  const weeklyPlan = useGymXStore((state) => state.weeklyPlan);
  const updatePlan = useGymXStore((state) => state.updateWeeklyPlan);
  const notificationTime = useGymXStore((state) => state.notificationTime);
  const setNotificationTime = useGymXStore((state) => state.setNotificationTime);
  const { theme, isDark } = useAppTheme();

  const [pickingDay, setPickingDay] = useState<WeekDay | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const todayName = format(new Date(), 'EEEE') as WeekDay;

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNotificationTime(selectedDate.getHours(), selectedDate.getMinutes());
    }
  };

  const selectWorkout = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pickingDay) {
      if (category === 'Rest Day') {
        updatePlan(pickingDay, []);
      } else {
        const current = weeklyPlan[pickingDay] || [];
        const updated = current.includes(category)
          ? current.filter(c => c !== category)
          : [...current, category];
        updatePlan(pickingDay, updated);
      }
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const workoutDaysCount = Object.values(weeklyPlan).filter(p => p.length > 0).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Professional Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
               <View>
                 <Text style={[styles.headerTitle, { color: theme.text }]}>Weekly Plan</Text>
                 <Text style={[styles.headerSubtitle, { color: theme.icon }]}>Simple and clean schedule</Text>
               </View>
               <TouchableOpacity 
                 activeOpacity={0.7}
                 onPress={() => setShowTimePicker(true)}
                 style={[styles.timerBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
               >
                 <Ionicons name="time-outline" size={18} color={theme.tint} />
                 <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(notificationTime.hour, notificationTime.minute)}</Text>
               </TouchableOpacity>
            </View>

            {/* Simple Insights */}
            <View style={styles.insightRow}>
               <View style={[styles.insightCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.insightVal, { color: theme.text }]}>{workoutDaysCount}</Text>
                  <Text style={[styles.insightLabel, { color: theme.icon }]}>Workout Days</Text>
               </View>
               <View style={[styles.insightCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.insightVal, { color: theme.text }]}>{7 - workoutDaysCount}</Text>
                  <Text style={[styles.insightLabel, { color: theme.icon }]}>Rest Days</Text>
               </View>
            </View>
          </View>

          {showTimePicker && (
             <Animated.View entering={FadeInUp} style={[styles.pickerOverlay, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <DateTimePicker
                  value={new Date(new Date().setHours(notificationTime.hour, notificationTime.minute))}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
                <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.doneBtn}>
                   <Text style={styles.doneBtnText}>Set Notification</Text>
                </TouchableOpacity>
             </Animated.View>
          )}

          {/* Clean Day List */}
          <View style={styles.listSection}>
            {DAYS.map((day, index) => {
              const isToday = todayName === day;
              const assigned = weeklyPlan[day] || [];
              const isRest = assigned.length === 0;
              
              return (
                <Animated.View 
                  key={day}
                  entering={FadeInDown.delay(index * 50)}
                >
                  <TouchableOpacity 
                    style={[
                      styles.dayItem, 
                      { backgroundColor: theme.card, borderColor: theme.border },
                      isToday && { borderColor: theme.tint, borderWidth: 2 }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                        Haptics.selectionAsync();
                        setPickingDay(day);
                    }}
                  >
                    <View style={styles.dayInfo}>
                       <Text style={[styles.dayName, { color: theme.text }, isToday && { color: theme.tint }]}>
                          {day}
                          {isToday && <Text style={styles.todayText}> • TODAY</Text>}
                       </Text>
                       <View style={styles.workoutSummary}>
                          {isRest ? (
                             <Text style={[styles.restInfo, { color: theme.icon }]}>Rest & Recovery</Text>
                          ) : (
                             <Text style={[styles.workInfo, { color: theme.text }]} numberOfLines={1}>
                                {assigned.join(' + ')}
                             </Text>
                          )}
                       </View>
                    </View>
                    <View style={[styles.editIcon, { backgroundColor: `${theme.tint}10` }]}>
                       <Ionicons name="pencil" size={14} color={theme.tint} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Simplified Grid Modal */}
      <Modal visible={!!pickingDay} transparent animationType="slide">
        <View style={styles.modalBg}>
           <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setPickingDay(null)} />
           <Animated.View entering={SlideInDown} style={[styles.modalSheet, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <View style={[styles.knob, { backgroundColor: theme.border }]} />
              <Text style={[styles.modalTitle, { color: theme.text }]}>{pickingDay} Focus</Text>
              
              <View style={styles.grid}>
                 {[...CATEGORIES.map(c => c.name), 'Cardio', 'Rest Day'].map((item) => {
                    const isSelected = item === 'Rest Day' ? weeklyPlan[pickingDay as WeekDay]?.length === 0 : weeklyPlan[pickingDay as WeekDay]?.includes(item);
                    return (
                       <TouchableOpacity 
                         key={item}
                         activeOpacity={0.7}
                         onPress={() => selectWorkout(item)}
                         style={[
                            styles.gridBlock, 
                            { backgroundColor: theme.card, borderColor: theme.border },
                            isSelected && { borderColor: theme.tint, backgroundColor: `${theme.tint}08` }
                         ]}
                       >
                          <Ionicons name={CATEGORY_ICONS[item] || 'flash-outline'} size={24} color={isSelected ? theme.tint : theme.icon} />
                          <Text style={[styles.gridLabel, { color: isSelected ? theme.text : theme.icon }]}>{item}</Text>
                          {isSelected && <View style={[styles.dot, { backgroundColor: theme.tint }]} />}
                       </TouchableOpacity>
                    );
                 })}
              </View>

              <TouchableOpacity style={styles.confirmBtn} onPress={() => setPickingDay(null)}>
                 <LinearGradient colors={[theme.tint, '#2563EB']} style={styles.confirmGrad}>
                    <Text style={styles.confirmBtnText}>Save Routine</Text>
                 </LinearGradient>
              </TouchableOpacity>
           </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 20, marginTop: 10, marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  timerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1 },
  timerText: { fontSize: 13, fontWeight: '800', marginLeft: 8 },
  insightRow: { flexDirection: 'row', gap: 12 },
  insightCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  insightVal: { fontSize: 20, fontWeight: '900' },
  insightLabel: { fontSize: 11, fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  pickerOverlay: { marginHorizontal: 20, borderRadius: 24, padding: 12, marginBottom: 20, borderWidth: 1, alignItems: 'center' },
  doneBtn: { marginTop: 10, backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  doneBtnText: { color: '#FFF', fontWeight: '900' },
  listSection: { paddingHorizontal: 20 },
  dayItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginBottom: 12, borderWidth: 1 },
  dayInfo: { flex: 1 },
  dayName: { fontSize: 17, fontWeight: '800' },
  todayText: { color: '#10B981', fontWeight: '900', fontSize: 11 },
  workoutSummary: { marginTop: 6 },
  restInfo: { fontSize: 14, fontWeight: '600', fontStyle: 'italic' },
  workInfo: { fontSize: 14, fontWeight: '700' },
  editIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { borderTopLeftRadius: 36, borderTopRightRadius: 36, borderTopWidth: 1, paddingBottom: 40, paddingHorizontal: 20 },
  knob: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 24, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  gridBlock: { width: (width - 50) / 2, paddingVertical: 20, borderRadius: 24, borderWidth: 1, alignItems: 'center', position: 'relative' },
  gridLabel: { fontSize: 14, fontWeight: '800', marginTop: 8 },
  dot: { position: 'absolute', top: 12, right: 12, width: 6, height: 6, borderRadius: 3 },
  confirmBtn: { height: 60, borderRadius: 20, overflow: 'hidden' },
  confirmGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  confirmBtnText: { color: '#FFF', fontSize: 17, fontWeight: '900' }
});
