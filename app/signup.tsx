import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BlurView } from 'expo-blur';

import { API_ENDPOINTS } from '@/constants/api';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const setAuth = useGymXStore((state) => state.setAuth);
  const { theme, isDark } = useAppTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Check all fields, athlete!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(API_ENDPOINTS.SIGNUP, { name, email, password });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email taken or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      setError('Enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, { email, otp });
      const { token, user } = response.data;
      
      setAuth(user, token);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Wrong code?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Immersive Auth Background */}
      <Animated.Image 
        entering={FadeIn.duration(1000)}
        source={require('../assets/images/authbg.jpg')}
        style={[styles.backgroundImage, { width, height }]}
        resizeMode="cover"
      />
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
               <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
               </TouchableOpacity>
               <Text style={styles.title}>{step === 1 ? 'Join the Elite' : 'Verify Email'}</Text>

               <Text style={styles.subtitle}>
                  {step === 1 ? 'Create your GymX profile' : `Enter the 6-digit code sent to ${email}`}
               </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.formContainer}>
               <BlurView intensity={30} tint="dark" style={styles.glassCard}>
                  {error ? (
                    <View style={styles.errorBanner}>
                       <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inputStack}>
                     {step === 1 ? (
                       <>
                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                               <Ionicons name="person" size={20} color="rgba(255,255,255,0.4)" />
                               <TextInput
                                  style={styles.input}
                                  placeholder="John Doe"
                                  placeholderTextColor="rgba(255,255,255,0.3)"
                                  value={name}
                                  onChangeText={setName}
                               />
                            </View>
                         </View>

                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                               <Ionicons name="mail" size={20} color="rgba(255,255,255,0.4)" />
                               <TextInput
                                  style={styles.input}
                                  placeholder="athlete@gymx.com"
                                  placeholderTextColor="rgba(255,255,255,0.3)"
                                  value={email}
                                  onChangeText={setEmail}
                                  autoCapitalize="none"
                                  keyboardType="email-address"
                               />
                            </View>
                         </View>

                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                               <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.4)" />
                               <TextInput
                                  style={styles.input}
                                  placeholder="••••••••"
                                  placeholderTextColor="rgba(255,255,255,0.3)"
                                  secureTextEntry
                                  value={password}
                                  onChangeText={setPassword}
                               />
                            </View>
                         </View>

                         <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
                            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.btnGradient}>
                               {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Join GymX</Text>}
                            </LinearGradient>
                         </TouchableOpacity>
                       </>
                     ) : (
                       <Animated.View entering={SlideInRight}>
                          <View style={styles.inputGroup}>
                             <Text style={styles.label}>Verification Code</Text>
                             <View style={styles.inputWrapper}>
                                <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
                                <TextInput
                                   style={[styles.input, { letterSpacing: 6, fontSize: 24, textAlign: 'center' }]}
                                   placeholder="123456"
                                   placeholderTextColor="rgba(255,255,255,0.2)"
                                   value={otp}
                                   onChangeText={setOtp}
                                   maxLength={6}
                                   keyboardType="number-pad"
                                />
                             </View>
                          </View>

                          <TouchableOpacity style={styles.signupBtn} onPress={handleVerifyOTP} disabled={loading}>
                             <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.btnGradient}>
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Verify & Continue</Text>}
                             </LinearGradient>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.resendBtn} onPress={handleSignup} disabled={loading}>
                             <Text style={styles.resendText}>Didn't get code? Resend</Text>
                          </TouchableOpacity>
                       </Animated.View>
                     )}
                  </View>
               </BlurView>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
               <Text style={styles.footerText}>Already part of GymX?</Text>
               <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.signupText}>Login</Text>
               </TouchableOpacity>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 60 },
  header: { marginBottom: 30, alignItems: 'center' },
  backBtn: { position: 'absolute', left: 0, top: -40, width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 80, height: 80, marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  subtitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: 6, textAlign: 'center' },
  formContainer: { borderRadius: 32, overflow: 'hidden' },
  glassCard: { padding: 24, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  errorText: { color: '#F87171', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  inputStack: { gap: 16 },
  inputGroup: {},
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '800', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, height: 58, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  input: { flex: 1, fontSize: 16, color: '#FFF', fontWeight: '700', marginLeft: 10 },
  signupBtn: { width: 220, height: 50, borderRadius: 25, overflow: 'hidden', marginTop: 10, alignSelf: 'center' },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  resendBtn: { alignSelf: 'center', marginTop: 15 },
  resendText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 8 },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },
  signupText: { color: '#3B82F6', fontSize: 15, fontWeight: '800' }
});
