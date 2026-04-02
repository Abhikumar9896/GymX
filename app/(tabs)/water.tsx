import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Modal, StatusBar } from 'react-native';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, SlideInDown, FadeInDown, interpolate, withDelay, withSequence } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const WATER_INCREMENTS = [
  { label: 'Sip', amount: 150, icon: 'water-outline' },
  { label: 'Glass', amount: 250, icon: 'wine-outline' },
  { label: 'Bottle', amount: 500, icon: 'beaker-outline' },
  { label: 'Large', amount: 1000, icon: 'flask-outline' },
];

function Bubble({ index, total }: { index: number, total: number }) {
  const floatAnim = useSharedValue(0);
  const sideAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withDelay(index * 400, withTiming(1, { duration: 4000 + (index * 500), easing: Easing.linear })),
      -1,
      false
    );
    sideAnim.value = withRepeat(
       withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
       ),
       -1,
       true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
       { translateY: interpolate(floatAnim.value, [0, 1], [0, -height]) },
       { translateX: interpolate(sideAnim.value, [-1, 1], [-15, 15]) }
    ],
    opacity: interpolate(floatAnim.value, [0, 0.5, 1], [0, 0.6, 0])
  }));

  return (
    <Animated.View style={[
       styles.bubble, 
       { left: `${(index / total) * 100}%`, bottom: '0%', width: 6 + (index % 6), height: 6 + (index % 6) },
       animatedStyle
    ]} />
  );
}

export default function WaterTrackerScreen() {
  const waterGoal = useGymXStore((state) => state.waterGoal);
  const intakeHistory = useGymXStore((state) => state.waterIntakeHistory);
  const addWater = useGymXStore((state) => state.addWater);
  const setWaterGoal = useGymXStore((state) => state.setWaterGoal);
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState(waterGoal.toString());
  const [lastAmount, setLastAmount] = useState<number | null>(null);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayIntake = intakeHistory.find(l => l.date === todayStr)?.amount || 0;
  const percentage = Math.min((todayIntake / waterGoal) * 100, 100);

  // Elite Fluid Dynamics Engine
  const wave1X = useSharedValue(0);
  const wave2X = useSharedValue(0);
  const wave3X = useSharedValue(0);

  useEffect(() => {
    wave1X.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.linear }), -1, false);
    wave2X.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.linear }), -1, false);
    wave3X.value = withRepeat(withTiming(1, { duration: 5500, easing: Easing.linear }), -1, false);
  }, []);

  const liquidBodyStyle = useAnimatedStyle(() => ({
    height: withTiming(`${Math.max(percentage, 8)}%`, { duration: 1800, easing: Easing.out(Easing.exp) }),
  }));

  const wave1Style = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(wave1X.value, [0, 1], [-width, 0]) }] }));
  const wave2Style = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(wave2X.value, [0, 1], [0, -width]) }] }));
  const wave3Style = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(wave3X.value, [0, 1], [-width, 0]) }] }));

  const handleAddWater = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addWater(amount);
    setLastAmount(amount);
  };

  const handleSubtract = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addWater(-amount);
  };

  // High Fidelity Wave Paths
  const waveP1 = `M0 25 Q ${width / 4} 10, ${width / 2} 25 T ${width} 25 V 80 H 0 Z`;
  const waveP2 = `M0 30 Q ${width / 4} 15, ${width / 2} 30 T ${width} 30 V 80 H 0 Z`;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#020617' : '#F1F5F9' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Immersive Fluid Engine Backdrop */}
      <View style={StyleSheet.absoluteFill}>
         <Animated.View style={[styles.waterBacking, liquidBodyStyle]}>
            <LinearGradient 
               colors={['#0EA5E9', '#0284C7', '#075985']} 
               style={StyleSheet.absoluteFill} 
            />
            
            {/* Multi-Layered Natural Wave Engine */}
            <View style={styles.waveLayerWrapper}>
               <Animated.View style={[styles.waveContainer, wave1Style, { top: -60, opacity: 0.3 }]}>
                  <Svg height="80" width={width * 2}>
                     <Path d={waveP1 + waveP1} fill="#7DD3FC" />
                  </Svg>
               </Animated.View>
               <Animated.View style={[styles.waveContainer, wave2Style, { top: -55, opacity: 0.5 }]}>
                  <Svg height="80" width={width * 2}>
                     <Path d={waveP2 + waveP2} fill="#38BDF8" />
                  </Svg>
               </Animated.View>
               <Animated.View style={[styles.waveContainer, wave3Style, { top: -50, opacity: 0.9 }]}>
                  <Svg height="80" width={width * 2}>
                     <Path d={waveP1 + waveP1} fill="#0EA5E9" />
                  </Svg>
               </Animated.View>
            </View>

            {/* Kinetic Bubble Engine */}
            <View style={styles.bubbleTrack}>
               {[...Array(8)].map((_, i) => (
                  <Bubble key={i} index={i} total={8} />
               ))}
            </View>
         </Animated.View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Elite Minimalist Header */}
        <View style={styles.header}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                 <Ionicons name="arrow-back" size={24} color={percentage > 85 ? '#FFF' : theme.text} />
              </TouchableOpacity>
              <View>
                 <Text style={[styles.navSub, { color: percentage > 85 ? 'rgba(255,255,255,0.7)' : theme.icon }]}>WATER INTAKE</Text>
                 <Text style={[styles.navTitle, { color: percentage > 85 ? '#FFF' : theme.text }]}>Hydration</Text>
              </View>
           </View>
           <TouchableOpacity 
             onPress={() => setShowGoalModal(true)} 
             style={[styles.glassGoal, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.1)' }]}
           >
              <Text style={[styles.glassGoalTxt, { color: percentage > 85 ? '#FFF' : theme.text }]}>{waterGoal}ml</Text>
           </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
           
           {/* Progress Visibility */}
           <View style={styles.progCenter}>
              <Animated.Text style={[styles.bigPerc, { color: percentage > 50 ? '#FFF' : theme.text }]}>
                 {Math.round(percentage)}%
              </Animated.Text>
              <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                 <Text style={[styles.badgeText, { color: percentage > 50 ? '#FFF' : theme.text }]}>{todayIntake} / {waterGoal} ml</Text>
              </View>
           </View>

           {/* Ultra-Compact Quick Actions */}
           <View style={styles.gridContainer}>
              <View style={styles.actionGrid}>
                 {WATER_INCREMENTS.map((item, idx) => (
                    <Animated.View key={item.label} entering={FadeInDown.delay(idx * 80)}>
                       <TouchableOpacity 
                          style={styles.actionCard}
                          onPress={() => handleAddWater(item.amount)}
                          onLongPress={() => handleSubtract(item.amount)}
                          activeOpacity={0.8}
                       >
                          <BlurView intensity={25} tint={isDark ? "dark" : "light"} style={styles.cardBlur}>
                             <Ionicons name={item.icon as any} size={22} color={percentage > 35 ? "#FFF" : theme.tint} />
                             <Text style={[styles.cardVal, { color: percentage > 35 ? "#FFF" : theme.text }]}>{item.amount}ml</Text>
                             <Text style={[styles.cardLbl, { color: percentage > 35 ? "rgba(255,255,255,0.7)" : theme.icon }]}>{item.label}</Text>
                          </BlurView>
                       </TouchableOpacity>
                    </Animated.View>
                 ))}
              </View>

              {lastAmount && (
                 <Animated.View entering={FadeInUp} style={styles.undoZone}>
                    <TouchableOpacity style={styles.undoButton} onPress={() => { handleSubtract(lastAmount); setLastAmount(null); }}>
                       <BlurView intensity={30} tint="dark" style={styles.undoGlass}>
                          <Ionicons name="refresh" size={16} color="#FFF" />
                          <Text style={styles.undoLabel}>Undo Entry ({lastAmount}ml)</Text>
                       </BlurView>
                    </TouchableOpacity>
                 </Animated.View>
              )}
           </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modern Goal Configuration */}
      <Modal visible={showGoalModal} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowGoalModal(false)} />
            <Animated.View entering={SlideInDown} style={[styles.modalSheet, { backgroundColor: isDark ? '#020617' : '#FFF' }]}>
               <View style={styles.knob} />
               <Text style={[styles.modalSub, { color: theme.text }]}>DAILY TARGET</Text>
               <View style={styles.inputStack}>
                  <TextInput
                     style={[styles.goalInput, { color: theme.text }]}
                     value={tempGoal}
                     onChangeText={setTempGoal}
                     keyboardType="numeric"
                  />
                  <Text style={[styles.goalUnit, { color: theme.tint }]}>ML</Text>
               </View>
               <TouchableOpacity style={styles.saveBtn} onPress={() => { setWaterGoal(parseInt(tempGoal)); setShowGoalModal(false); }}>
                  <LinearGradient colors={['#0EA5E9', '#2563EB']} style={styles.saveGrad}>
                     <Text style={styles.saveTxt}>Confirm Daily Goal</Text>
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
  waterBacking: { position: 'absolute', bottom: 0, width: '100%', zIndex: 0 },
  waveLayerWrapper: { position: 'absolute', width: '100%', height: '100%' },
  waveContainer: { position: 'absolute', width: width * 2, height: 80, flexDirection: 'row' },
  bubbleTrack: { position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' },
  bubble: { position: 'absolute', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  header: { paddingHorizontal: 24, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navSub: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  navTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  glassGoal: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  glassGoalTxt: { fontSize: 13, fontWeight: '900' },
  progCenter: { height: height * 0.38, justifyContent: 'center', alignItems: 'center' },
  bigPerc: { fontSize: 64, fontWeight: '900' },
  badge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, marginTop: 12 },
  badgeText: { fontSize: 16, fontWeight: '800' },
  gridContainer: { paddingHorizontal: 20 },
  actionGrid: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  actionCard: { width: (width - 64) / 4, height: 75, borderRadius: 20, overflow: 'hidden' },
  cardBlur: { flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardVal: { fontSize: 14, fontWeight: '900', marginTop: 4 },
  cardLbl: { fontSize: 10, fontWeight: '700' },
  undoZone: { marginTop: 24, alignItems: 'center' },
  undoButton: { borderRadius: 24, overflow: 'hidden' },
  undoGlass: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12 },
  undoLabel: { color: '#FFF', fontSize: 13, fontWeight: '900', marginLeft: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, paddingBottom: 50, alignItems: 'center' },
  knob: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 30 },
  modalSub: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  inputStack: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 40 },
  goalInput: { fontSize: 60, fontWeight: '900', padding: 0 },
  goalUnit: { fontSize: 26, fontWeight: '900', marginLeft: 15 },
  saveBtn: { width: '90%', height: 60, borderRadius: 20, overflow: 'hidden' },
  saveGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  saveTxt: { color: '#FFF', fontSize: 18, fontWeight: '900' }
});
