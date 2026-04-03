import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Cinematic Background */}
      <Animated.Image 
        entering={FadeIn.duration(1500)}
        source={require('../assets/images/welcomebg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)', '#000']}
        style={styles.gradientOverlay}
      />

      <View style={styles.content}>


        <View style={styles.bottomSection}>
           <Animated.View entering={FadeInDown.delay(500).duration(1000)}>
              <Text style={styles.title}>Push Your{'\n'}<Text style={{ color: '#3B82F6' }}>Limits</Text> Further</Text>
              <Text style={styles.description}>
                Experience the ultimate fitness ecosystem. Precision tracking, elite workouts, and a community of athletes.
              </Text>
           </Animated.View>

           <Animated.View 
              entering={FadeInDown.delay(800).duration(1000)}
              style={styles.buttonContainer}
           >
              <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.mainBtn}
                onPress={() => router.replace('/login')}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>Start Journey</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryBtn}
                onPress={() => router.push('/signup')}
              >
                 <BlurView intensity={20} tint="light" style={styles.blurBtn}>
                    <Text style={styles.secondaryBtnText}>Create Account</Text>
                 </BlurView>
              </TouchableOpacity>
           </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { width: width, height: height * 0.85, position: 'absolute', top: 0 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 30, paddingVertical: 60 },
  header: { alignItems: 'center', marginTop: 20 },
  logo: { width: 80, height: 80, borderRadius: 20 },
  brandName: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
  bottomSection: { paddingBottom: 20 },
  title: { color: '#FFF', fontSize: 40, fontWeight: '900', lineHeight: 46, letterSpacing: -1 },
  description: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 22, marginTop: 16, fontWeight: '500' },
  buttonContainer: { marginTop: 30, gap: 12, alignItems: 'center' },
  mainBtn: { width: 220, height: 50, borderRadius: 25, overflow: 'hidden' },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  secondaryBtn: { width: 220, height: 50, borderRadius: 25, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  blurBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
