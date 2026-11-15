import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, cardStyle, screenStyle } from '../theme';
import { computeTopicStats, pct } from '../utils/stats';

export default function SubjectOverviewScreen({ route, navigation }) {
  const { subject } = route.params;
  const { papers, attempts, targets } = useApp();

  const subjectPapers = useMemo(() => papers.filter((p) => p.subject === subject), [papers, subject]);

  const results = useMemo(() => {
    const map = {};
    subjectPapers.forEach((p) => {
      map[p.id] = p;
    });
    return attempts.filter((a) => map[a.paperId]).map((a) => ({ attempt: a, pct: pct(a.score, map[a.paperId].totalMarks) }));
  }, [attempts, subjectPapers]);

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.pct, 0) / results.length) : 0;
  const best = results.length ? Math.max(...results.map((r) => r.pct)) : null;
  const worst = results.length ? Math.min(...results.map((r) => r.pct)) : null;
  const target = targets[subject] || 0;

  const topicStats = useMemo(
    () => computeTopicStats(papers, attempts).filter((s) => s.subject === subject).sort((a, b) => b.lost - a.lost),
    [papers, attempts, subject]
  );

  return (
    <View style={screenStyle}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.sub}>
          {subjectPapers.length} papers · {results.length} attempts
        </Text>

        <View style={styles.grid}>
          <View style={[styles.stat, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.statValue}>{avg}%</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.successLight }]}>
            <Text style={styles.statValue}>{best === null ? '-' : `${best}%`}</Text>
            <Text style={styles.statLabel}>Best</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.statValue}>{worst === null ? '-' : `${worst}%`}</Text>
            <Text style={styles.statLabel}>Worst</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Target score: {target}%</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${Math.min(100, avg)}%` }]} />
            <View style={[styles.targetMark, { left: `${Math.min(100, target)}%` }]} />
          </View>
          <Text style={styles.cardSub}>
            {results.length === 0
              ? 'Log an attempt to compare with your target.'
              : avg >= target
              ? 'You are meeting your target. Keep it up!'
              : `${target - avg}% below your target average.`}
          </Text>
        </View>

        <Text style={styles.heading}>Topic Breakdown</Text>
        {topicStats.map((t) => (
          <TouchableOpacity
            key={t.topic}
            style={styles.topicRow}
            onPress={() => navigation.navigate('TopicDetails', { subject, topic: t.topic })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.topicName}>{t.topic}</Text>
              <View style={styles.smallBarBg}>
                <View style={[styles.smallBarFill, { width: `${Math.min(100, t.errorPct)}%` }]} />
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
              <Text style={styles.topicLost}>{t.lost > 0 ? `-${t.lost}` : '0'}</Text>
              <Text style={styles.topicLabel}>{t.errorPct}% error</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: colors.text },
  sub: { color: colors.muted, fontWeight: '700', marginTop: 2, marginBottom: 14 },
  grid: { flexDirection: 'row', marginBottom: 14 },
  stat: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.text },
  statLabel: { fontWeight: '700', color: colors.muted, fontSize: 12, marginTop: 2 },
  card: { ...cardStyle },
  cardTitle: { fontWeight: '900', fontSize: 16, color: colors.text, marginBottom: 12 },
  cardSub: { color: colors.muted, fontWeight: '700', marginTop: 10 },
  barBg: { height: 12, backgroundColor: colors.line, borderRadius: 6 },
  barFill: { height: 12, backgroundColor: colors.primary, borderRadius: 6 },
  targetMark: {
    position: 'absolute',
    top: -4,
    width: 3,
    height: 20,
    backgroundColor: colors.amber,
    borderRadius: 2,
  },
  heading: { fontWeight: '900', fontSize: 16, color: colors.text, marginBottom: 10 },
  topicRow: { ...cardStyle, flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10 },
  topicName: { fontWeight: '800', fontSize: 15, color: colors.text, marginBottom: 8 },
  smallBarBg: { height: 6, backgroundColor: colors.line, borderRadius: 3, overflow: 'hidden' },
  smallBarFill: { height: 6, backgroundColor: colors.amber, borderRadius: 3 },
  topicLost: { fontWeight: '900', color: colors.danger, fontSize: 18 },
  topicLabel: { color: colors.muted, fontWeight: '700', fontSize: 11 },
});
