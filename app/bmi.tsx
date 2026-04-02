import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width } = Dimensions.get('window');

export default function BMICalculatorScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bmi: string, category: string, color: string } | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      const bmiVal = parseFloat(bmi);
      
      let category = 'Normal';
      let color = '#10B981'; // Green
      
      if (bmiVal < 18.5) {
        category = 'Underweight';
        color = '#3B82F6'; // Blue
      } else if (bmiVal >= 25 && bmiVal < 30) {
        category = 'Overweight';
        color = '#F59E0B'; // Orange
      } else if (bmiVal >= 30) {
        category = 'Obese';
        color = '#EF4444'; // Red
      }
      
      setResult({ bmi, category, color });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={isDark ? ['#0F172A', '#1E293B'] : [theme.background, theme.card]} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.border }]}>
                <Ionicons name="chevron-back" size={24} color={theme.text} />
              </TouchableOpacity>
              <View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>BMI Calculator</Text>
                <Text style={[styles.headerSubtitle, { color: theme.icon }]}>Body Mass Index Analysis</Text>
              </View>
            </View>

            <Animated.View entering={FadeInUp.delay(200)} style={styles.inputSection}>
               <View style={[styles.inputCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.inputGroup}>
                     <View style={[styles.inputIconBg, { backgroundColor: `${theme.tint}15` }]}>
                        <Ionicons name="barbell-outline" size={24} color={theme.tint} />
                     </View>
                     <View style={styles.inputTextContainer}>
                        <Text style={[styles.inputLabel, { color: theme.icon }]}>Weight (kg)</Text>
                        <TextInput
                           style={[styles.textInput, { color: theme.text }]}
                           placeholder="75"
                           placeholderTextColor={theme.icon}
                           keyboardType="numeric"
                           value={weight}
                           onChangeText={setWeight}
                        />
                     </View>
                  </View>
                  
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />

                  <View style={styles.inputGroup}>
                     <View style={[styles.inputIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                        <Ionicons name="resize-outline" size={24} color="#10B981" />
                     </View>
                     <View style={styles.inputTextContainer}>
                        <Text style={[styles.inputLabel, { color: theme.icon }]}>Height (cm)</Text>
                        <TextInput
                           style={[styles.textInput, { color: theme.text }]}
                           placeholder="180"
                           placeholderTextColor={theme.icon}
                           keyboardType="numeric"
                           value={height}
                           onChangeText={setHeight}
                        />
                     </View>
                  </View>
               </View>

               <TouchableOpacity style={styles.calcBtn} onPress={calculateBMI}>
                  <LinearGradient colors={[theme.tint, '#2563EB']} style={styles.calcGradient}>
                     <Text style={styles.calcText}>Calculate BMI</Text>
                     <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                  </LinearGradient>
               </TouchableOpacity>
            </Animated.View>

            {result && (
              <Animated.View entering={FadeInDown} style={styles.resultContainer}>
                 <Text style={[styles.resultHeading, { color: theme.text }]}>Your Results</Text>
                 <BlurView intensity={30} tint={isDark ? "light" : "dark"} style={[styles.resultCard, { backgroundColor: isDark ? 'transparent' : `${theme.card}80` }]}>
                    <View style={[styles.resultCircle, { borderColor: result.color }]}>
                       <Text style={[styles.resultValue, { color: result.color }]}>{result.bmi}</Text>
                       <Text style={[styles.resultUnit, { color: theme.icon }]}>BMI</Text>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor: `${result.color}15` }]}>
                       <View style={[styles.dot, { backgroundColor: result.color }]} />
                       <Text style={[styles.categoryText, { color: result.color }]}>{result.category}</Text>
                    </View>
                    
                    <View style={styles.descriptionRow}>
                       <Ionicons name="information-circle-outline" size={18} color={theme.icon} />
                       <Text style={[styles.descriptionText, { color: theme.icon }]}>
                          {result.category === 'Normal' ? 
                            "Great job! You are in the healthy weight range. Keep up the good work." : 
                            "Consider consulting a professional to learn more about your body composition."}
                       </Text>
                    </View>
                 </BlurView>
              </Animated.View>
            )}
            
            <View style={styles.infoSection}>
               <Text style={[styles.infoTitle, { color: theme.icon }]}>BMI Standards</Text>
               <View style={styles.infoRow}>
                  <View style={[styles.indicator, { backgroundColor: '#3B82F6' }]} />
                  <Text style={[styles.infoLabel, { color: theme.icon }]}>Underweight &lt; 18.5</Text>
               </View>
               <View style={styles.infoRow}>
                  <View style={[styles.indicator, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.infoLabel, { color: theme.icon }]}>Healthy 18.5 - 24.9</Text>
               </View>
               <View style={styles.infoRow}>
                  <View style={[styles.indicator, { backgroundColor: '#F59E0B' }]} />
                  <Text style={[styles.infoLabel, { color: theme.icon }]}>Overweight 25 - 29.9</Text>
               </View>
               <View style={styles.infoRow}>
                  <View style={[styles.indicator, { backgroundColor: '#EF4444' }]} />
                  <Text style={[styles.infoLabel, { color: theme.icon }]}>Obese &ge; 30</Text>
               </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    marginTop: 20, 
    marginBottom: 32 
  },
  backBtn: { 
    width: 44, height: 44, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', 
    marginRight: 16 
  },
  headerTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  headerSubtitle: { fontSize: 14, fontWeight: '600' },
  inputSection: { paddingHorizontal: 24, marginBottom: 32 },
  inputCard: { 
    borderRadius: 28, 
    overflow: 'hidden', borderWidth: 1,
  },
  inputGroup: { flexDirection: 'row', alignItems: 'center', padding: 24 },
  inputIconBg: { 
    width: 52, height: 52, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center', 
    marginRight: 20 
  },
  inputTextContainer: { flex: 1 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  textInput: { fontSize: 24, fontWeight: '800' },
  divider: { height: 1, marginHorizontal: 24 },
  calcBtn: { width: 220, height: 50, borderRadius: 25, overflow: 'hidden', alignSelf: 'center', marginTop: 10 },
  calcGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  calcText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  resultContainer: { paddingHorizontal: 24, marginBottom: 40 },
  resultHeading: { fontSize: 20, fontWeight: '900', marginBottom: 20 },
  resultCard: { padding: 32, borderRadius: 32, alignItems: 'center', overflow: 'hidden' },
  resultCircle: { 
    width: 140, height: 140, borderRadius: 70, borderWidth: 8, 
    alignItems: 'center', justifyContent: 'center', marginBottom: 20 
  },
  resultValue: { fontSize: 40, fontWeight: '900' },
  resultUnit: { fontSize: 14, fontWeight: '800', marginTop: -4 },
  categoryBadge: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  categoryText: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  descriptionRow: { flexDirection: 'row', marginTop: 24, paddingHorizontal: 10 },
  descriptionText: { 
    fontSize: 13, 
    fontWeight: '600', marginLeft: 10, lineHeight: 20 
  },
  infoSection: { paddingHorizontal: 32 },
  infoTitle: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  indicator: { width: 12, height: 12, borderRadius: 4, marginRight: 12 },
  infoLabel: { fontSize: 14, fontWeight: '600' }
});
