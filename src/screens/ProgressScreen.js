import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Chip from '../components/Chip';
import LineChart from '../components/LineChart';
import { colors, cardStyle, screenStyle } from '../theme';
import { paperMap, pct, sortAttemptsAsc, sortAttemptsDesc } from '../utils/stats';
import { prettyKey } from '../utils/dates';

export default function ProgressScreen({ navigation }) {
  const { papers, attempts, subjects } = useApp();
  const [subject, setSubject] = useState('All');

  const map = useMemo(() => paperMap(papers), [papers]);

  const filtered = useMemo(
    () => attempts.filter((a) => map[a.paperId] && (subject === 'All' || map[a.paperId].subject === subject)),
    [attempts, map, subject]
  );

  const chartData = useMemo(
    () =>
      sortAttemptsAsc(filtered)
        .slice(-10)
        .map((a) => pct(a.score, map[a.paperId].totalMarks)),
    [filtered, map]
  );

  const history = useMemo(() => sortAttemptsDesc(filtered), [filtered]);

  return (
    <View style={screenStyle}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', ...Object.keys(subjects)].map((s) => (
            <Chip key={s} label={s} active={subject === s} onPress={() => setSubject(s)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 30 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Score Over Time</Text>
          <Text style={styles.cardSub}>Last {Math.min(10, chartData.length)} attempts (% score)</Text>
          {chartData.length === 0 ? (
            <Text style={styles.empty}>No attempts to chart yet.</Text>
          ) : (
            <LineChart data={chartData} />
          )}
        </View>

        <Text style={styles.heading}>Attempt Log ({history.length})</Text>
        {history.length === 0 && <Text style={styles.empty}>No attempts logged for this filter.</Text>}
        {history.map((a) => {
          const paper = map[a.paperId];
          const p = pct(a.score, paper.totalMarks);
          return (
            <TouchableOpacity
              key={a.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AddAttempt', { attemptId: a.id })}
            >
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle}>{paper.title}</Text>
                  <Text style={styles.meta}>{prettyKey(a.date)}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={colors.muted} />
                    <Text style={styles.metaText}>{a.timeTaken ? `${a.timeTaken} min` : 'Time not set'}</Text>
                  </View>
                </View>
                <View style={[styles.scoreBubble, { backgroundColor: p >= 70 ? colors.successLight : p >= 50 ? colors.amberLight : '#FEE2E2' }]}>
                  <Text style={styles.scoreText}>{p}%</Text>
                  <Text style={styles.scoreSub}>
                    {a.score}/{paper.totalMarks}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle },
  cardTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  cardSub: { color: colors.muted, fontWeight: '600', marginBottom: 10, marginTop: 2 },
  heading: { fontWeight: '900', fontSize: 16, color: colors.text, marginBottom: 10 },
  empty: { color: colors.muted, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  paperTitle: { fontWeight: '900', fontSize: 16, color: colors.text },
  meta: { color: colors.muted, fontWeight: '600', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { marginLeft: 4, color: colors.muted, fontWeight: '600', fontSize: 12 },
  scoreBubble: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  scoreText: { fontWeight: '900', fontSize: 20, color: colors.text },
  scoreSub: { fontWeight: '700', fontSize: 11, color: colors.muted },
});
