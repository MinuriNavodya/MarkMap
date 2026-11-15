import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Chip from '../components/Chip';
import { colors, cardStyle, screenStyle } from '../theme';
import { computeWeakTopics } from '../utils/stats';

export default function WeakTopicsScreen({ navigation }) {
  const { papers, attempts, subjects } = useApp();
  const [subject, setSubject] = useState('All');

  const topics = useMemo(() => computeWeakTopics(papers, attempts, subject), [papers, attempts, subject]);
  const first = topics[0];

  const open = (t) => navigation.navigate('TopicDetails', { subject: t.subject, topic: t.topic });

  return (
    <View style={screenStyle}>
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', ...Object.keys(subjects)].map((s) => (
            <Chip key={s} label={s} active={subject === s} onPress={() => setSubject(s)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 6, paddingBottom: 30 }}>
        {first ? (
          <TouchableOpacity activeOpacity={0.9} style={styles.banner} onPress={() => open(first)}>
            <View style={styles.bannerTag}>
              <Ionicons name="flash" size={14} color={colors.text} />
              <Text style={styles.bannerTagText}>Revise Next</Text>
            </View>
            <Text style={styles.bannerTopic}>{first.topic}</Text>
            <Text style={styles.bannerSub}>
              {first.subject} · {first.lost} marks lost · {first.errorPct}% error rate
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.card}>
            <Text style={styles.empty}>No weak topics for this filter yet. Log attempts and mark the topics you struggled with.</Text>
          </View>
        )}

        {topics.length > 0 && <Text style={styles.heading}>Ranked by marks lost</Text>}

        {topics.map((t, i) => (
          <TouchableOpacity key={`${t.subject}${t.topic}`} style={styles.card} activeOpacity={0.85} onPress={() => open(t)}>
            <View style={styles.row}>
              <View style={styles.rank}>
                <Text style={styles.rankText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topic}>{t.topic}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t.subject}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.lost}>-{t.lost}</Text>
                <Text style={styles.lostLabel}>marks lost</Text>
              </View>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${Math.min(100, t.errorPct)}%` }]} />
            </View>
            <Text style={styles.errText}>
              {t.errorPct}% error · flagged {t.flagged} time{t.flagged === 1 ? '' : 's'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { paddingHorizontal: 16, paddingVertical: 12 },
  banner: {
    backgroundColor: colors.amberSoft,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  bannerTagText: { fontWeight: '900', marginLeft: 4, color: colors.text },
  bannerTopic: { fontSize: 26, fontWeight: '900', color: colors.text, marginTop: 10 },
  bannerSub: { fontWeight: '700', color: colors.text, marginTop: 4 },
  heading: { fontWeight: '900', fontSize: 16, color: colors.text, marginBottom: 10 },
  card: { ...cardStyle },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.amberLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: { fontWeight: '900', color: colors.text },
  topic: { fontSize: 16, fontWeight: '900', color: colors.text },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  badgeText: { color: colors.primary, fontWeight: '800', fontSize: 11 },
  lost: { fontSize: 22, fontWeight: '900', color: colors.danger },
  lostLabel: { fontSize: 11, color: colors.muted, fontWeight: '700' },
  barBg: { height: 8, backgroundColor: colors.line, borderRadius: 4, marginTop: 12, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.amber, borderRadius: 4 },
  errText: { marginTop: 6, color: colors.muted, fontWeight: '700', fontSize: 12 },
  empty: { color: colors.muted, fontWeight: '600' },
});
