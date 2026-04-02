import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAppTheme } from '@/hooks/useAppTheme';

import { API_ENDPOINTS } from '@/constants/api';

const { width } = Dimensions.get('window');

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
      setError(err.response?.data?.message || 'Email already exists or server error.');
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={isDark ? ['#0F172A', '#1E293B'] : [theme.background, theme.card]} style={StyleSheet.absoluteFill} />
      {isDark && <View style={styles.neonGlow} />}

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)} style={styles.backBtn}>
               <Ionicons name="chevron-back" size={24} color={theme.tint} />
            </TouchableOpacity>

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
               <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
               <Text style={[styles.title, { color: theme.text }]}>{step === 1 ? 'Join GymX' : 'Verify Email'}</Text>
               <Text style={[styles.subtitle, { color: theme.icon }]}>
                 {step === 1 ? 'Start your fitness journey today' : `Verification code sent to ${email}`}
               </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
               {error ? (
                 <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                 </View>
               ) : null}

               {step === 1 ? (
                 <>
                   <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                         <Ionicons name="person-outline" size={20} color={theme.icon} />
                         <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="John Doe"
                            placeholderTextColor={theme.icon}
                            value={name}
                            onChangeText={setName}
                         />
                      </View>
                   </View>

                   <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                         <Ionicons name="mail-outline" size={20} color={theme.icon} />
                         <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="athlete@gymx.com"
                            placeholderTextColor={theme.icon}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                         />
                      </View>
                   </View>

                   <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                         <Ionicons name="lock-closed-outline" size={20} color={theme.icon} />
                         <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="••••••••"
                            placeholderTextColor={theme.icon}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                         />
                      </View>
                   </View>

                   <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
                      <LinearGradient 
                        colors={[theme.tint, '#2563EB']} 
                        style={styles.btnGradient}
                      >
                         {loading ? (
                           <ActivityIndicator color="#FFF" />
                         ) : (
                           <Text style={styles.btnText}>Send Code</Text>
                         )}
                      </LinearGradient>
                   </TouchableOpacity>
                 </>
               ) : (
                 <Animated.View entering={SlideInRight}>
                    <View style={styles.inputContainer}>
                       <Text style={[styles.label, { color: theme.text }]}>Verification Code</Text>
                       <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Ionicons name="shield-checkmark-outline" size={20} color={theme.tint} />
                          <TextInput
                             style={[styles.input, { color: theme.text, letterSpacing: 4, textAlign: 'center' }]}
                             placeholder="123456"
                             placeholderTextColor={theme.icon}
                             value={otp}
                             onChangeText={setOtp}
                             maxLength={6}
                             keyboardType="number-pad"
                          />
                       </View>
                    </View>

                    <TouchableOpacity style={styles.signupBtn} onPress={handleVerifyOTP} disabled={loading}>
                       <LinearGradient 
                         colors={[theme.tint, '#2563EB']} 
                         style={styles.btnGradient}
                       >
                          {loading ? (
                            <ActivityIndicator color="#FFF" />
                          ) : (
                            <Text style={styles.btnText}>Verify Account</Text>
                          )}
                       </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.resendBtn} 
                      onPress={handleSignup}
                      disabled={loading}
                    >
                       <Text style={[styles.resendText, { color: theme.icon }]}>Didn't receive? Resend Code</Text>
                    </TouchableOpacity>
                 </Animated.View>
               )}
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  neonGlow: { 
    position: 'absolute', top: -100, right: -100, 
    width: 300, height: 300, borderRadius: 150, 
    backgroundColor: 'rgba(59, 130, 246, 0.05)', 
    filter: 'blur(100px)' 
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginTop: 20, marginBottom: 10 },
  header: { marginBottom: 40, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: '900', letterSpacing: -1, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  form: {},
  errorBanner: { 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingVertical: 12, 
    paddingHorizontal: 16, borderRadius: 12, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
  inputContainer: { marginBottom: 20 },
  label: { fontWeight: '800', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 18, 
    paddingHorizontal: 16, height: 60 
  },
  input: { flex: 1, marginLeft: 12, fontSize: 18, fontWeight: '800' },
  signupBtn: { height: 62, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  resendBtn: { marginTop: 24, alignSelf: 'center' },
  resendText: { fontSize: 14, fontWeight: '700' }
});
