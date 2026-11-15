import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, cardStyle, primaryButton, screenStyle } from '../theme';
import { pct, sortAttemptsDesc } from '../utils/stats';
import { prettyKey } from '../utils/dates';

const Row = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default function PaperDetailsScreen({ route, navigation }) {
  const { papers, attempts } = useApp();
  const paper = papers.find((p) => p.id === route.params?.paperId);

  if (!paper) {
    return (
      <View style={[screenStyle, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.empty}>Paper not found.</Text>
      </View>
    );
  }

  const history = sortAttemptsDesc(attempts.filter((a) => a.paperId === paper.id));
  const best = history.length ? Math.max(...history.map((a) => pct(a.score, paper.totalMarks))) : null;

  return (
    <View style={screenStyle}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.subjectTag}
            onPress={() => navigation.navigate('SubjectOverview', { subject: paper.subject })}
          >
            <Text style={styles.subjectText}>{paper.subject}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>{paper.title}</Text>
          <Text style={styles.code}>{paper.code}</Text>

          <View style={{ marginTop: 10 }}>
            <Row label="Year" value={paper.year} />
            <Row label="Paper Type" value={paper.type} />
            <Row label="Total Marks" value={paper.totalMarks} />
            <Row label="Duration" value={`${paper.duration} minutes`} />
            <Row label="Best Score" value={best === null ? 'Not attempted' : `${best}%`} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Topic Breakdown</Text>
          <View style={styles.topicWrap}>
            {paper.topics.map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.topicChip}
                onPress={() => navigation.navigate('TopicDetails', { subject: paper.subject, topic: t })}
              >
                <Text style={styles.topicText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Attempts ({history.length})</Text>
          {history.length === 0 && <Text style={styles.empty}>You haven't attempted this paper yet.</Text>}
          {history.map((a) => {
            const p = pct(a.score, paper.totalMarks);
            return (
              <TouchableOpacity
                key={a.id}
                style={styles.attemptRow}
                onPress={() => navigation.navigate('AddAttempt', { attemptId: a.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.attemptDate}>{prettyKey(a.date)}</Text>
                  <Text style={styles.attemptSub}>
                    {a.score}/{paper.totalMarks}
                    {a.timeTaken ? ` · ${a.timeTaken} min` : ''}
                  </Text>
                  {a.weakTopics && a.weakTopics.length > 0 && (
                    <Text style={styles.attemptWeak}>Weak: {a.weakTopics.join(', ')}</Text>
                  )}
                </View>
                <Text style={styles.attemptPct}>{p}%</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={primaryButton} onPress={() => navigation.navigate('AddAttempt', { paperId: paper.id })}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.btnText}>Log Attempt</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle },
  subjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  subjectText: { color: colors.primary, fontWeight: '800', fontSize: 12, marginRight: 2 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 10 },
  code: { color: colors.muted, fontWeight: '700', marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  infoLabel: { color: colors.muted, fontWeight: '700' },
  infoValue: { color: colors.text, fontWeight: '800' },
  cardTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 10 },
  topicWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  topicChip: {
    backgroundColor: colors.amberLight,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  topicText: { fontWeight: '800', color: colors.text, fontSize: 13 },
  empty: { color: colors.muted, fontWeight: '600' },
  attemptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  attemptDate: { fontWeight: '800', color: colors.text },
  attemptSub: { color: colors.muted, fontWeight: '600', marginTop: 2 },
  attemptWeak: { color: '#B45309', fontWeight: '700', fontSize: 12, marginTop: 2 },
  attemptPct: { fontSize: 22, fontWeight: '900', color: colors.primary },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16, marginLeft: 8 },
});
