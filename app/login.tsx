import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BlurView } from 'expo-blur';

import { API_ENDPOINTS } from '@/constants/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const setAuth = useGymXStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Enter your credentials, athlete.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
      const { token, user } = response.data;
      setAuth(user, token);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check server/internet.');
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
        source={require('../assets/images/auth-bg.png')}
        style={[styles.backgroundImage, { width, height }]}
        resizeMode="cover"
      />
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
               <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
               </TouchableOpacity>
               <Text style={styles.title}>Welcome Back</Text>

               <Text style={styles.subtitle}>Relog to continue your mission</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400)} style={styles.formContainer}>
               <BlurView intensity={30} tint="dark" style={styles.glassCard}>
                  {error ? (
                    <View style={styles.errorBanner}>
                       <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inputStack}>
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

                     <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                        <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.btnGradient}>
                           {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Login Now</Text>}
                        </LinearGradient>
                     </TouchableOpacity>

                     <TouchableOpacity 
                        style={styles.forgotBtn}
                        onPress={() => router.push({ pathname: '/forgot-password', params: { initialEmail: email } })}
                     >
                        <Text style={styles.forgotText}>Forgot your password?</Text>
                     </TouchableOpacity>
                  </View>
               </BlurView>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
               <Text style={styles.footerText}>New to GymX?</Text>
               <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupText}>Join the Elite</Text>
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
  header: { marginBottom: 40, alignItems: 'center' },
  backBtn: { position: 'absolute', left: 0, top: -40, width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 90, height: 90, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  subtitle: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  formContainer: { borderRadius: 32, overflow: 'hidden' },
  glassCard: { padding: 30, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  errorText: { color: '#F87171', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  inputStack: { gap: 20 },
  inputGroup: {},
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '800', marginBottom: 10, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, height: 60, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  input: { flex: 1, fontSize: 16, color: '#FFF', fontWeight: '700', marginLeft: 12 },
  loginBtn: { width: 220, height: 50, borderRadius: 25, overflow: 'hidden', marginTop: 10, alignSelf: 'center' },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  forgotBtn: { alignSelf: 'center', marginTop: 10 },
  forgotText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40, gap: 8 },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },
  signupText: { color: '#3B82F6', fontSize: 15, fontWeight: '800' }
});
