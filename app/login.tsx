import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { useGymXStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAppTheme } from '@/hooks/useAppTheme';

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
      setError('Please enter your credentials');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login to:', API_ENDPOINTS.LOGIN);
      const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
      const { token, user } = response.data;
      
      setAuth(user, token);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.log('Login Error Details:', err.request ? 'Network Error (Check URL)' : err.message);
      if (err.response) {
        // The server responded with a status code that falls out of the range of 2xx
        setError(err.response.data?.message || 'Invalid credentials');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Login failed. Cannot reach server. Check your internet and ngrok URL.');
      } else {
        setError('Login failed. Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={isDark ? ['#0F172A', '#1E293B'] : [theme.background, theme.card]} style={StyleSheet.absoluteFill} />
      <View style={[styles.neonGlow, { backgroundColor: theme.tint, opacity: isDark ? 0.1 : 0.05 }]} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
               <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
               <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
               <Text style={[styles.subtitle, { color: theme.icon }]}>Log in to continue your progress</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400)} style={styles.form}>
               {error ? (
                 <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                 </View>
               ) : null}

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

               <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                  <LinearGradient 
                    colors={[theme.tint, '#2563EB']} 
                    style={styles.btnGradient}
                  >
                     {loading ? (
                       <ActivityIndicator color="#FFF" />
                     ) : (
                       <Text style={styles.btnText}>Login</Text>
                     )}
                  </LinearGradient>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={styles.forgotBtn} 
                 onPress={() => router.push({ pathname: '/forgot-password', params: { initialEmail: email } })}
               >
                  <Text style={[styles.forgotText, { color: theme.icon }]}>Forgot Password?</Text>
               </TouchableOpacity>


            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
               <Text style={[styles.footerText, { color: theme.icon }]}>New athlete?</Text>
               <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={[styles.signupText, { color: theme.tint }]}>Join Now</Text>
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
  safeArea: { flex: 1 },
  neonGlow: { 
    position: 'absolute', top: -100, right: -100, 
    width: 300, height: 300, borderRadius: 150, 
    filter: 'blur(100px)' 
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 60 },
  header: { marginBottom: 60, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 42, fontWeight: '900', letterSpacing: -1, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  form: { marginTop: 20 },
  errorBanner: { 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingVertical: 12, 
    paddingHorizontal: 16, borderRadius: 12, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '800', marginBottom: 10, marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 18, 
    paddingHorizontal: 16, height: 64 
  },
  input: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 12 },
  loginBtn: { height: 64, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: 15, fontWeight: '600' },
  signupText: { fontSize: 15, fontWeight: '800', marginLeft: 6 },
  forgotBtn: { alignSelf: 'center', marginTop: 24 },
  forgotText: { fontSize: 14, fontWeight: '700' }
});
