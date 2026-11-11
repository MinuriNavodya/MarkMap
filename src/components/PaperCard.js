import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, cardStyle } from '../theme';

export default function PaperCard({ paper, scorePct, onPress }) {
  const attempted = scorePct !== null && scorePct !== undefined;
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.subjectTag}>
          <Text style={styles.subjectText}>{paper.subject}</Text>
        </View>
        <View style={[styles.status, attempted ? styles.statusDone : styles.statusTodo]}>
          <Text style={[styles.statusText, { color: attempted ? colors.success : '#B45309' }]}>
            {attempted ? `Attempted - ${scorePct}%` : 'Not Attempted'}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{paper.title}</Text>
      <Text style={styles.code}>{paper.code}</Text>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={14} color={colors.muted} />
          <Text style={styles.metaText}>{paper.year}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color={colors.muted} />
          <Text style={styles.metaText}>{paper.duration} min</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="document-text-outline" size={14} color={colors.muted} />
          <Text style={styles.metaText}>{paper.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectTag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  subjectText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  status: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
  statusDone: { backgroundColor: colors.successLight },
  statusTodo: { backgroundColor: colors.amberLight },
  statusText: { fontWeight: '800', fontSize: 12 },
  title: { fontSize: 17, fontWeight: '900', color: colors.text },
  code: { color: colors.muted, fontWeight: '600', marginTop: 2 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  metaText: { marginLeft: 4, color: colors.muted, fontWeight: '600', fontSize: 12 },
});
