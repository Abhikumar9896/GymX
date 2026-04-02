import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, colorScheme, isDark } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={isDark ? ['transparent', 'rgba(15, 23, 42, 0.7)', 'rgba(15, 23, 42, 1)'] : ['transparent', 'rgba(255,255,255,0.7)', theme.background]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000)}
          style={styles.logoContainer}
        >
          <Image 
             source={require('../assets/images/logo.png')} 
             style={[styles.logo, { borderColor: theme.border }]}
             resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(400).duration(1000)}
            style={[styles.title, { color: theme.text }]}
          >
            GYMX
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(600).duration(1000)}
            style={styles.subtitle}
          >
            BECOME THE BEST VERSION OF YOURSELF
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(800).duration(1000)}
            style={[styles.description, { color: theme.icon }]}
          >
            Track your progress, join categories, and reach your peak performance with the most advanced gym companion.
          </Animated.Text>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(1000).duration(1000)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.replace('/login')}
          >
            <LinearGradient
              colors={[theme.tint, '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height * 0.7,
    position: 'absolute',
    top: 0,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
    textAlign: 'center',
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    marginVertical: 10,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});
