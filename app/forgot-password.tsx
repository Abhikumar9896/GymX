import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

import { API_ENDPOINTS } from '@/constants/api';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { initialEmail } = useLocalSearchParams();

  const [email, setEmail] = useState((initialEmail as string) || '');
  const [otp, setOtp] = useState('');

  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      setStep(2);
      setMessage('Recovery code sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setError('Check all fields, athlete!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(API_ENDPOINTS.RESET_PASSWORD, { email, otp, newPassword });
      alert('Password reset successfully! Log in now.');
      router.replace('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code or reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)} style={styles.backBtn}>
               <Ionicons name="chevron-back" size={24} color="#60A5FA" />
            </TouchableOpacity>

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
               <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
               <Text style={styles.title}>{step === 1 ? 'Recovery' : 'Set New Password'}</Text>
               <Text style={styles.subtitle}>
                 {step === 1 ? "Enter your email for the recovery code" : `Enter the 6-digit code sent to ${email}`}
               </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
               {error ? (
                 <View style={[styles.statusBanner, styles.errorBanner]}>
                    <Text style={styles.errorText}>{error}</Text>
                 </View>
               ) : message ? (
                  <View style={[styles.statusBanner, styles.successBanner]}>
                    <Text style={styles.successText}>{message}</Text>
                 </View>
               ) : null}

               {step === 1 ? (
                 <Animated.View entering={SlideInRight}>
                   <View style={styles.inputContainer}>
                      <Text style={styles.label}>Registered Email</Text>
                      <View style={styles.inputWrapper}>
                         <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.4)" />
                         <TextInput
                            style={styles.input}
                            placeholder="athlete@gymx.com"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                         />
                      </View>
                   </View>

                   <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOTP} disabled={loading}>
                      <LinearGradient 
                        colors={['#3B82F6', '#2563EB']} 
                        style={styles.btnGradient}
                      >
                         {loading ? (
                           <ActivityIndicator color="#FFF" />
                         ) : (
                           <Text style={styles.btnText}>Send Recovery Code</Text>
                         )}
                      </LinearGradient>
                   </TouchableOpacity>
                 </Animated.View>
               ) : (
                 <Animated.View entering={SlideInRight}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>6-Digit Recovery Code</Text>
                      <View style={styles.inputWrapper}>
                         <Ionicons name="shield-checkmark-outline" size={20} color="#60A5FA" />
                         <TextInput
                            style={[styles.input, { letterSpacing: 4, textAlign: 'center' }]}
                            placeholder="123456"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value={otp}
                            onChangeText={setOtp}
                            maxLength={6}
                            keyboardType="number-pad"
                         />
                      </View>
                   </View>

                   <View style={styles.inputContainer}>
                      <Text style={styles.label}>New Secure Password</Text>
                      <View style={styles.inputWrapper}>
                         <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.4)" />
                         <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                         />
                      </View>
                   </View>

                   <TouchableOpacity style={styles.primaryBtn} onPress={handleResetPassword} disabled={loading}>
                      <LinearGradient 
                        colors={['#3B82F6', '#2563EB']} 
                        style={styles.btnGradient}
                      >
                         {loading ? (
                           <ActivityIndicator color="#FFF" />
                         ) : (
                           <Text style={styles.btnText}>Reset Password</Text>
                         )}
                      </LinearGradient>
                   </TouchableOpacity>
                   
                   <TouchableOpacity 
                     style={styles.resendBtn} 
                     onPress={handleSendOTP}
                     disabled={loading}
                   >
                      <Text style={styles.resendText}>Resend recovery code</Text>
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
  container: { flex: 1, backgroundColor: '#0F172A' },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginTop: 20, marginBottom: 10 },
  header: { marginBottom: 40, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  form: {},
  statusBanner: { 
    paddingVertical: 12, 
    paddingHorizontal: 16, borderRadius: 12, marginBottom: 20,
    borderWidth: 1
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  successBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  successText: { color: '#10B981', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  label: { color: '#FFF', fontWeight: '800', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#1E293B', borderWidth: 1, 
    borderColor: '#334155', borderRadius: 18, 
    paddingHorizontal: 16, height: 60 
  },
  input: { flex: 1, color: '#FFF', marginLeft: 12, fontSize: 18, fontWeight: '800' },
  primaryBtn: { height: 62, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  resendBtn: { marginTop: 24, alignSelf: 'center' },
  resendText: { color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: '700' }
});
