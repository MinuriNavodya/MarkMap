import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary },
  text: { fontWeight: '700', color: colors.text, fontSize: 13 },
  textActive: { color: '#fff' },
});
