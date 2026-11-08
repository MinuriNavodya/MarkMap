import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, cardStyle, primaryButton, screenStyle } from '../theme';
import { computeOverview, computeWeakTopics } from '../utils/stats';
import { todayKey } from '../utils/dates';

export default function HomeScreen({ navigation }) {
  const { papers, attempts, plan, togglePlanItem } = useApp();

  const overview = useMemo(() => computeOverview(papers, attempts), [papers, attempts]);
  const weakTop3 = useMemo(() => computeWeakTopics(papers, attempts).slice(0, 3), [papers, attempts]);
  const todayTasks = plan.filter((p) => p.dateKey === todayKey());

  return (
    <View style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Overview cards grid */}
        <View style={styles.grid}>
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="stats-chart" size={22} color={colors.primary} />
            <Text style={styles.statValue}>{overview.average}%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.amberLight }]}>
            <Ionicons name="trophy" size={22} color={colors.amber} />
            <Text style={styles.statValue}>{overview.attemptedThisMonth}</Text>
            <Text style={styles.statLabel}>Papers This Month</Text>
          </View>
        </View>

        {/* Today's plan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Plan</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Planner')}>
              <Text style={styles.link}>Open planner</Text>
            </TouchableOpacity>
          </View>
          {todayTasks.length === 0 ? (
            <Text style={styles.empty}>Nothing planned for today. Add a paper or topic in the Planner.</Text>
          ) : (
            todayTasks.map((t) => (
              <TouchableOpacity key={t.id} style={styles.taskRow} onPress={() => togglePlanItem(t.id)}>
                <Ionicons
                  name={t.done ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={t.done ? colors.success : colors.primary}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={[styles.taskTitle, t.done && styles.taskDone]}>{t.title}</Text>
                  <Text style={styles.taskSub}>{t.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Top 3 weak topics */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top 3 Weak Topics</Text>
            <TouchableOpacity onPress={() => navigation.navigate('WeakTopics')}>
              <Text style={styles.link}>See all</Text>
            </TouchableOpacity>
          </View>
          {weakTop3.length === 0 ? (
            <Text style={styles.empty}>No weak topics yet. Log an attempt to see them here.</Text>
          ) : (
            weakTop3.map((t, i) => (
              <TouchableOpacity
                key={`${t.subject}${t.topic}`}
                style={styles.weakRow}
                onPress={() => navigation.navigate('TopicDetails', { subject: t.subject, topic: t.topic })}
              >
                <View style={styles.rank}>
                  <Text style={styles.rankText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{t.topic}</Text>
                  <Text style={styles.taskSub}>
                    {t.subject} · {t.lost} marks lost
                  </Text>
                </View>
                <View style={styles.urgent}>
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={primaryButton} onPress={() => navigation.navigate('AddAttempt')}>
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.btnText}>Log New Attempt</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 30 },
  grid: { flexDirection: 'row', marginBottom: 14 },
  statCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 4,
  },
  statValue: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 6 },
  statLabel: { fontWeight: '700', color: colors.muted, marginTop: 2 },
  card: { ...cardStyle },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  link: { color: colors.primary, fontWeight: '800' },
  empty: { color: colors.muted, fontWeight: '600' },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  taskTitle: { fontWeight: '800', color: colors.text, fontSize: 15 },
  taskDone: { textDecorationLine: 'line-through', color: colors.muted },
  taskSub: { color: colors.muted, fontWeight: '600', fontSize: 12, marginTop: 2 },
  weakRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  rank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.amberLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: { fontWeight: '900', color: colors.text },
  urgent: { backgroundColor: colors.amberSoft, borderRadius: 10, paddingVertical: 4, paddingHorizontal: 9 },
  urgentText: { fontWeight: '900', fontSize: 11, color: colors.text },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16, marginLeft: 8 },
});
