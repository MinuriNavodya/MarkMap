import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function AuthField({ label, icon, secure = false, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <Ionicons name={icon} size={20} color={colors.muted} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secure && !show}
          {...props}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShow(!show)} hitSlop={8}>
            <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '900', color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontWeight: '700', color: colors.text },
});
