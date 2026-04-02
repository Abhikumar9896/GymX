import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Dimensions, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform, FlatList, Alert, Linking } from 'react-native';
import { useGymXStore } from '@/store/useStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, SlideInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width, height } = Dimensions.get('window');

const ACHIEVEMENTS = [
  { id: '1', title: 'Early Bird', icon: 'sunny-outline', color: '#F59E0B', desc: 'Workout before 7 AM' },
  { id: '2', title: 'Iron Soul', icon: 'barbell-outline', color: '#10B981', desc: '50+ Heavy sets' },
  { id: '3', title: 'Hydra King', icon: 'water-outline', color: '#0EA5E9', desc: 'Daily goal x2' },
  { id: '4', title: 'Streak Master', icon: 'flame-outline', color: '#EF4444', desc: '7 days active' },
  { id: '5', title: 'Calorie Burner', icon: 'fitness-outline', color: '#8B5CF6', desc: '10k Calories total' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const user = useGymXStore((state) => state.user);
  const setUser = useGymXStore((state) => state.setUser);
  const logout = useGymXStore((state) => state.logout);
  const workoutHistory = useGymXStore((state) => state.workoutHistory);
  const notificationsEnabled = useGymXStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useGymXStore((state) => state.setNotificationsEnabled);
  const themePreference = useGymXStore((state) => state.themePreference);
  const setThemePreference = useGymXStore((state) => state.setThemePreference);

  const { theme, isDark } = useAppTheme();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUser, setEditUser] = useState({ ...user });

  // Elite Stats 
  const userLevel = Math.floor((user.points || 1250) / 1000) + 1;
  const levelProgress = ((user.points || 1250) % 1000) / 10; // 0-100
  const totalWorkouts = workoutHistory.length;
  const totalCalories = workoutHistory.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => {
          logout();
          router.replace('/login');
        } 
      }
    ]);
  };

  const handleSaveProfile = () => {
    setUser(editUser);
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLanguageChange = () => {
    Alert.alert('Select Language', 'Currently only English (US) is available.', [{ text: 'OK' }]);
  };

  const handleFeedback = () => {
    Alert.alert('Feedback', 'We value your feedback! Send us an email at support@gymx.com', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Email', onPress: () => Linking.openURL('mailto:support@gymx.com?subject=GymX Feedback') }
    ]);
  };

  const handleSupport = () => {
    Alert.alert('Help Center', 'Redirecting to support documentation...', [
      { text: 'Cancel' },
      { text: 'Visit', onPress: () => Linking.openURL('https://gymx.app/support') }
    ]);
  };

  const SettingRow = ({ icon, title, value, type = 'arrow', color = theme.tint, onPress, component, isLast }: any) => (
    <TouchableOpacity 
        style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]} 
        onPress={onPress}
        activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.rowTextContainer}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        {value && <Text style={[styles.rowValue, { color: theme.icon }]}>{value}</Text>}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
         {type === 'arrow' && <Ionicons name="chevron-forward" size={16} color={theme.icon} />}
         {type === 'switch' && component}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
             <View>
                <Text style={[styles.headerSub, { color: theme.icon }]}>MY ACCOUNT</Text>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
             </View>
             <TouchableOpacity style={[styles.headerIconBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => setEditModalVisible(true)}>
                <Ionicons name="options-outline" size={24} color={theme.text} />
             </TouchableOpacity>
          </View>

          {/* User Identity Card */}
          <View style={styles.heroContainer}>
             <Animated.View entering={FadeInUp.springify()} style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.profileMain}>
                   <View style={styles.avatarWrapper}>
                      <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300' }}
                        style={[styles.avatar, { borderColor: theme.border }]}
                      />
                      <LinearGradient colors={['#F59E0B', '#EF4444']} style={[styles.levelBadge, { borderColor: theme.card }]}>
                         <Text style={styles.levelText}>{userLevel}</Text>
                      </LinearGradient>
                   </View>
                   <View style={styles.profileMeta}>
                      <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
                      <View style={styles.identityTag}>
                         <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.tagBlur}>
                            <Ionicons name="shield-checkmark" size={12} color={theme.tint} />
                            <Text style={[styles.tagText, { color: theme.tint }]}>ELITE ATHLETE</Text>
                         </BlurView>
                      </View>
                   </View>
                </View>

                {/* Level Progress */}
                <View style={styles.levelProgressContainer}>
                   <View style={styles.levelInfo}>
                      <Text style={[styles.levelLabel, { color: theme.icon }]}>Level {userLevel} Progress</Text>
                      <Text style={[styles.levelValue, { color: theme.text }]}>{Math.round(levelProgress)}%</Text>
                   </View>
                   <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                      <Animated.View 
                         style={[
                            styles.progressBarFill, 
                            { width: `${levelProgress}%`, backgroundColor: theme.tint }
                         ]} 
                      />
                   </View>
                   <Text style={[styles.xpText, { color: theme.icon }]}>{user.points % 1000} / 1000 XP to next level</Text>
                </View>
             </Animated.View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
             <Animated.View entering={FadeInDown.delay(100)} style={[styles.statItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statVal, { color: theme.text }]}>{totalWorkouts}</Text>
                <Text style={[styles.statLbl, { color: theme.icon }]}>Sessions</Text>
             </Animated.View>
             <Animated.View entering={FadeInDown.delay(200)} style={[styles.statItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statVal, { color: theme.text }]}>{user.weight}kg</Text>
                <Text style={[styles.statLbl, { color: theme.icon }]}>Current</Text>
             </Animated.View>
             <Animated.View entering={FadeInDown.delay(300)} style={[styles.statItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.statVal, { color: theme.text }]}>{Math.floor(totalCalories / 100) / 10}k</Text>
                <Text style={[styles.statLbl, { color: theme.icon }]}>Calories</Text>
             </Animated.View>
          </View>

          {/* Achievements Horizontal */}
          <View style={styles.sectionHeaderContainer}>
             <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
             <TouchableOpacity onPress={() => router.push('/performance')}>
                <Text style={{ color: theme.tint, fontWeight: '700', fontSize: 13 }}>View All</Text>
             </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementScroll}>
             {ACHIEVEMENTS.map((item, idx) => (
                <Animated.View key={item.id} entering={SlideInRight.delay(idx * 100)} style={[styles.achievementCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                   <View style={[styles.achIcon, { backgroundColor: `${item.color}15` }]}>
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
                   </View>
                   <Text style={[styles.achTitle, { color: theme.text }]}>{item.title}</Text>
                   <Text style={[styles.achDesc, { color: theme.icon }]}>{item.desc}</Text>
                </Animated.View>
             ))}
          </ScrollView>

          {/* Preferences Section */}
          <Text style={[styles.listHeader, { color: theme.icon }]}>APP SETTINGS</Text>
          <View style={[styles.optionsGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
             <SettingRow 
                icon="notifications-outline" 
                title="Smart Notifications" 
                value="Daily workout reminders"
                type="switch"
                component={
                    <Switch 
                        value={notificationsEnabled} 
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#334155', true: theme.tint }} 
                        thumbColor={Platform.OS === 'android' ? '#F8FAFC' : ''}
                    />
                }
             />
             <SettingRow 
                icon="moon-outline" 
                title="Dark Theme" 
                type="switch"
                component={
                    <Switch 
                        value={themePreference === 'dark'} 
                        onValueChange={(val) => setThemePreference(val ? 'dark' : 'light')}
                        trackColor={{ false: '#334155', true: theme.tint }} 
                        thumbColor={Platform.OS === 'android' ? '#F8FAFC' : ''}
                    />
                }
             />
             <SettingRow 
                icon="calculator-outline" 
                title="BMI Calculator" 
                value="Analyze your body mass"
                color="#8B5CF6"
                onPress={() => router.push('/bmi')}
             />
             <SettingRow 
                icon="language-outline" 
                title="App Language" 
                value="English (US)" 
                color="#10B981" 
                onPress={handleLanguageChange}
             />
             <SettingRow 
                icon="shield-outline" 
                title="Privacy & Security" 
                color="#8B5CF6" 
                onPress={() => Alert.alert('Privacy', 'Your data is encrypted and stored locally on your device.')}
                isLast
             />
          </View>

          {/* Support Section */}
          <Text style={[styles.listHeader, { color: theme.icon }]}>SUPPORT & INFO</Text>
          <View style={[styles.optionsGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
             <SettingRow icon="chatbubble-outline" title="Feedback" color="#0EA5E9" onPress={handleFeedback} />
             <SettingRow icon="help-circle-outline" title="Help Center" color="#F59E0B" onPress={handleSupport} />
             <SettingRow icon="information-circle-outline" title="About GymX" color="#64748B" onPress={() => Alert.alert('About GymX', 'GymX Platform v1.5.0\nBuilt for athletes by athletes.')} isLast />
          </View>

          {/* Danger Zone */}
          <TouchableOpacity 
            style={[styles.logoutBtn, { borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)' }]} 
            onPress={handleLogout}
          >
             <Ionicons name="log-out-outline" size={20} color="#EF4444" />
             <Text style={styles.logoutTxt}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[styles.version, { color: theme.icon }]}>GYMX PLATFORM • VERSION 1.5.0</Text>
          <View style={{ height: 40 }} />

        </ScrollView>
      </SafeAreaView>


      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
           <TouchableOpacity 
             style={StyleSheet.absoluteFill} 
             onPress={() => setEditModalVisible(false)} 
           />
           <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
              <Animated.View entering={FadeInUp} style={[styles.modalBody, { backgroundColor: isDark ? '#0F172A' : '#FFF' }]}>
                 <View style={[styles.modalKnob, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
                 <Text style={[styles.modalTitle, { color: theme.text }]}>Settings</Text>
                 
                 <View style={styles.fieldStack}>
                    <Text style={[styles.fieldLabel, { color: theme.icon }]}>PROFILE NAME</Text>
                    <TextInput 
                        style={[styles.fieldInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                        value={editUser.name}
                        onChangeText={(t) => setEditUser({ ...editUser, name: t })}
                    />
                 </View>

                 <View style={styles.fieldRow}>
                    <View style={styles.flex1}>
                       <Text style={[styles.fieldLabel, { color: theme.icon }]}>WEIGHT (KG)</Text>
                       <TextInput 
                          style={[styles.fieldInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                          value={String(editUser.weight)}
                          keyboardType="numeric"
                          onChangeText={(t) => setEditUser({ ...editUser, weight: Number(t) })}
                       />
                    </View>
                    <View style={styles.flex1}>
                       <Text style={[styles.fieldLabel, { color: theme.icon }]}>HEIGHT (CM)</Text>
                       <TextInput 
                          style={[styles.fieldInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                          value={String(editUser.height)}
                          keyboardType="numeric"
                          onChangeText={(t) => setEditUser({ ...editUser, height: Number(t) })}
                       />
                    </View>
                 </View>

                 <View style={styles.fieldStack}>
                    <Text style={[styles.fieldLabel, { color: theme.icon }]}>PRIMARY FITNESS GOAL</Text>
                    <TextInput 
                        style={[styles.fieldInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                        value={editUser.goal}
                        onChangeText={(t) => setEditUser({ ...editUser, goal: t })}
                    />
                 </View>

                 <TouchableOpacity style={styles.saveAction} onPress={handleSaveProfile}>
                    <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.saveGrad}>
                       <Text style={styles.saveLabel}>Update Profile</Text>
                    </LinearGradient>
                 </TouchableOpacity>
              </Animated.View>
           </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 20
  },
  headerSub: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  headerIconBtn: { 
    width: 48, height: 48, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1
  },
  heroContainer: { paddingHorizontal: 20, marginTop: 10 },
  heroCard: { 
    borderRadius: 32, padding: 24, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
  },
  profileMain: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3 },
  levelBadge: { 
    position: 'absolute', bottom: -5, right: -5, 
    width: 30, height: 30, borderRadius: 15, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 2
  },
  levelText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  profileMeta: { marginLeft: 20 },
  userName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  identityTag: { marginTop: 6, borderRadius: 10, overflow: 'hidden' },
  tagBlur: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: '900', marginLeft: 5, letterSpacing: 1 },
  levelProgressContainer: { marginTop: 25 },
  levelInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'flex-end' },
  levelLabel: { fontSize: 12, fontWeight: '700' },
  levelValue: { fontSize: 14, fontWeight: '900' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  xpText: { fontSize: 10, fontWeight: '600', marginTop: 8, textAlign: 'right' },
  statsGrid: { 
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 20 
  },
  statItem: { 
    flex: 1, borderRadius: 24, padding: 16, 
    alignItems: 'center', borderWidth: 1 
  },
  statVal: { fontSize: 20, fontWeight: '900' },
  statLbl: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  sectionHeaderContainer: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingHorizontal: 24, marginTop: 35, marginBottom: 15
  },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  achievementScroll: { paddingLeft: 20, paddingRight: 10 },
  achievementCard: { 
    width: 140, borderRadius: 24, padding: 16, 
    marginRight: 12, borderWidth: 1 
  },
  achIcon: { 
    width: 50, height: 50, borderRadius: 18, 
    alignItems: 'center', justifyContent: 'center', marginBottom: 12 
  },
  achTitle: { fontSize: 14, fontWeight: '800' },
  achDesc: { fontSize: 10, fontWeight: '600', marginTop: 4, opacity: 0.7 },
  listHeader: { 
    fontSize: 11, fontWeight: '900', letterSpacing: 1.5, 
    marginTop: 35, marginLeft: 28, marginBottom: 15 
  },
  optionsGroup: { 
    marginHorizontal: 20, borderRadius: 32, 
    padding: 10, borderWidth: 1, overflow: 'hidden' 
  },
  settingRow: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingVertical: 14, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  iconWrapper: { 
    width: 44, height: 44, borderRadius: 15, 
    alignItems: 'center', justifyContent: 'center' 
  },
  rowTextContainer: { flex: 1, marginLeft: 16 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowValue: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  logoutBtn: { 
    width: 160, height: 44, 
    borderRadius: 22, borderWidth: 1, 
    alignSelf: 'center',
    marginTop: 40,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  logoutTxt: { color: '#EF4444', fontSize: 16, fontWeight: '900', marginLeft: 10 },
  version: { 
    fontSize: 10, fontWeight: '800', textAlign: 'center', 
    marginTop: 30, letterSpacing: 1, opacity: 0.5 
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  keyboardView: { width: '100%' },
  modalBody: { 
    borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    padding: 30, paddingBottom: 60
  },
  modalKnob: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 28, fontWeight: '900', marginBottom: 30, textAlign: 'center' },
  fieldStack: { marginBottom: 20 },
  fieldRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  flex1: { flex: 1 },
  fieldLabel: { fontSize: 10, fontWeight: '900', marginBottom: 8, marginLeft: 4, letterSpacing: 1 },
  fieldInput: { 
    borderRadius: 18, height: 60, paddingHorizontal: 20, 
    fontSize: 16, fontWeight: '700', borderWidth: 1
  },
  saveAction: { width: 220, height: 50, borderRadius: 25, overflow: 'hidden', alignSelf: 'center', marginTop: 15 },
  saveGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  saveLabel: { color: '#FFF', fontSize: 18, fontWeight: '900' }
});

