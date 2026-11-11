import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors, APP_NAME } from '../theme';

export default function Header({
  title,
  showBack = false,
  isHome = false,
  showLog = true,
  showProfile = true,
  navigation,
}) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const heading = isHome ? APP_NAME : title || APP_NAME;
  const firstName = user && user.name ? user.name.split(' ')[0] : '';
  const initial = user && user.name ? user.name.trim().charAt(0).toUpperCase() : '';

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.mascot}>
            <Text style={styles.mascotEmoji}>🦉</Text>
          </View>
        )}
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {heading}
          </Text>
          {isHome && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {showLog && (
          <TouchableOpacity style={styles.logBtn} onPress={() => navigation.navigate('AddAttempt')}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.logText}>Log</Text>
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Settings')}>
            {initial ? (
              <Text style={styles.initial}>{initial}</Text>
            ) : (
              <Ionicons name="person" size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  right: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  mascot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.amberLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mascotEmoji: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
  },
  logText: { color: '#fff', fontWeight: '800', marginLeft: 2 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontWeight: '900', color: colors.primary, fontSize: 16 },
});
