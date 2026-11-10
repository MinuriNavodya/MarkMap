import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import AuthField from '../components/AuthField';
import { APP_NAME, colors, cardStyle, primaryButton, screenStyle } from '../theme';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setBusy(true);
    const res = await login(email, password);
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={screenStyle} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 40, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.mascot}>
            <Text style={{ fontSize: 40 }}>🦉</Text>
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.tagline}>Past Paper Score Tracker & Revision Planner</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.sub}>Log in to continue your revision.</Text>

          <AuthField
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AuthField
            label="Password"
            icon="lock-closed-outline"
            placeholder="Your password"
            secure
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={submit}
          />

          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity style={[primaryButton, { marginTop: 20, opacity: busy ? 0.7 : 1 }]} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log In</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.note}>Your account and data are stored only on this device.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 22 },
  mascot: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.amberLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 32, fontWeight: '900', color: colors.primary, marginTop: 10 },
  tagline: { color: colors.muted, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  card: { ...cardStyle, padding: 20 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text },
  sub: { color: colors.muted, fontWeight: '600', marginTop: 2 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 10,
    marginTop: 14,
  },
  errorText: { color: colors.danger, fontWeight: '700', marginLeft: 8, flex: 1 },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  footerText: { color: colors.muted, fontWeight: '700' },
  footerLink: { color: colors.primary, fontWeight: '900' },
  note: { textAlign: 'center', color: colors.muted, fontWeight: '600', fontSize: 12, marginTop: 14 },
});
