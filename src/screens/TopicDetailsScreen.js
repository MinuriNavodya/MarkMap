import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, cardStyle, screenStyle } from '../theme';
import { computeTopicStats, paperMap, pct, sortAttemptsDesc } from '../utils/stats';
import { prettyKey } from '../utils/dates';

export default function TopicDetailsScreen({ route, navigation }) {
  const { subject, topic } = route.params;
  const { papers, attempts } = useApp();

  const map = useMemo(() => paperMap(papers), [papers]);
  const stat = useMemo(
    () => computeTopicStats(papers, attempts).find((s) => s.subject === subject && s.topic === topic),
    [papers, attempts, subject, topic]
  );

  const mistakes = useMemo(
    () =>
      sortAttemptsDesc(
        attempts.filter(
          (a) => map[a.paperId] && map[a.paperId].subject === subject && (a.weakTopics || []).includes(topic)
        )
      ),
    [attempts, map, subject, topic]
  );

  return (
    <View style={screenStyle}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{subject}</Text>
          </View>
          <Text style={styles.topic}>{topic}</Text>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stat ? stat.lost : 0}</Text>
              <Text style={styles.statLabel}>Marks lost</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stat ? stat.errorPct : 0}%</Text>
              <Text style={styles.statLabel}>Error rate</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stat ? stat.flagged : 0}</Text>
              <Text style={styles.statLabel}>Times flagged</Text>
            </View>
          </View>
        </View>

        <Text style={styles.heading}>Papers where you struggled</Text>
        {mistakes.length === 0 && <Text style={styles.empty}>No mistakes recorded for this topic yet.</Text>}
        {mistakes.map((a) => {
          const paper = map[a.paperId];
          return (
            <TouchableOpacity
              key={a.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('PaperDetails', { paperId: paper.id })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle}>{paper.title}</Text>
                  <Text style={styles.paperSub}>{prettyKey(a.date)}</Text>
                  {a.notes ? <Text style={styles.note}>"{a.notes}"</Text> : null}
                </View>
                <Text style={styles.score}>{pct(a.score, paper.totalMarks)}%</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.amberSoft,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  badgeText: { fontWeight: '900', color: colors.text, fontSize: 12 },
  topic: { fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 10 },
  statRow: { flexDirection: 'row', marginTop: 14 },
  stat: { flex: 1 },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.text },
  statLabel: { fontWeight: '700', color: colors.text, fontSize: 12 },
  heading: { fontWeight: '900', fontSize: 16, color: colors.text, marginBottom: 10 },
  empty: { color: colors.muted, fontWeight: '600' },
  card: { ...cardStyle },
  paperTitle: { fontWeight: '900', fontSize: 16, color: colors.text },
  paperSub: { color: colors.muted, fontWeight: '600', marginTop: 2 },
  note: { color: colors.text, fontStyle: 'italic', marginTop: 6 },
  score: { fontSize: 22, fontWeight: '900', color: colors.danger, marginLeft: 10 },
});
