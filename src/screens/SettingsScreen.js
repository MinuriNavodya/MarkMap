import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, colors, cardStyle, screenStyle } from '../theme';

export default function SettingsScreen({ navigation }) {
  const { subjects, targets, setTarget, resetData } = useApp();
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Log out', 'You can log back in anytime. Your data stays saved on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const confirmReset = (loadSample) => {
    Alert.alert(
      loadSample ? 'Load sample data' : 'Clear all data',
      loadSample
        ? 'Your attempts and plans will be replaced with the sample data.'
        : 'All your attempts and plans will be deleted. The paper library stays.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            await resetData(loadSample);
            Alert.alert('Done', loadSample ? 'Sample data loaded.' : 'Your data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={screenStyle}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        {/* Account */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <View style={styles.accountRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user && user.name ? user.name.trim().charAt(0).toUpperCase() : '?'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name} numberOfLines={1}>{user ? user.name : ''}</Text>
              <Text style={styles.email} numberOfLines={1}>{user ? user.email : ''}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Target Score per Subject</Text>
          {Object.keys(subjects).map((s) => (
            <View key={s} style={styles.targetRow}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('SubjectOverview', { subject: s })}>
                <Text style={styles.subject}>{s}</Text>
                <Text style={styles.link}>View overview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setTarget(s, (targets[s] || 0) - 5)}>
                <Ionicons name="remove" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.value}>{targets[s]}%</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setTarget(s, (targets[s] || 0) + 5)}>
                <Ionicons name="add" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data</Text>
          <TouchableOpacity style={styles.dataBtn} onPress={() => confirmReset(true)}>
            <Ionicons name="refresh" size={18} color={colors.primary} />
            <Text style={styles.dataText}>Load sample data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dataBtn, { borderColor: colors.danger }]} onPress={() => confirmReset(false)}>
            <Ionicons name="trash" size={18} color={colors.danger} />
            <Text style={[styles.dataText, { color: colors.danger }]}>Clear all attempts and plans</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.about}>
            {APP_NAME} – Past Paper Score Tracker & Revision Planner. Track your past paper scores, find weak topics and
            plan your revision. Works fully offline: accounts and data are stored only on your device.
          </Text>
          <Text style={styles.version}>Version 1.1.0</Text>
          <Text style={styles.version}>© 2026 {APP_NAME}. ICA 03 – React Native project.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle },
  cardTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 12 },
  accountRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '900', color: colors.primary },
  name: { fontWeight: '900', fontSize: 17, color: colors.text },
  email: { color: colors.muted, fontWeight: '600', marginTop: 2 },
  logoutBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  logoutText: { color: '#fff', fontWeight: '900', fontSize: 16, marginLeft: 8 },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  subject: { fontWeight: '800', color: colors.text, fontSize: 15 },
  link: { color: colors.primary, fontWeight: '700', fontSize: 12, marginTop: 2 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  value: { width: 56, textAlign: 'center', fontWeight: '900', fontSize: 16, color: colors.text },
  dataBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  dataText: { fontWeight: '800', color: colors.primary, marginLeft: 8 },
  about: { color: colors.text, fontWeight: '600', lineHeight: 20 },
  version: { color: colors.muted, fontWeight: '700', marginTop: 8 },
});
