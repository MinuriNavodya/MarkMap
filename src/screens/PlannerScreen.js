import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Chip from '../components/Chip';
import { colors, cardStyle, screenStyle } from '../theme';
import { dayName, getWeekDates, shortDate, toKey, todayKey } from '../utils/dates';

export default function PlannerScreen({ navigation }) {
  const { papers, subjects, plan, addPlanItem, togglePlanItem, removePlanItem } = useApp();
  const [offset, setOffset] = useState(0);
  const [modalDate, setModalDate] = useState(null);
  const [tab, setTab] = useState('paper');

  const week = getWeekDates(offset);
  const today = todayKey();
  const weekLabel =
    offset === 0 ? 'Current Week' : offset === 1 ? 'Next Week' : offset === -1 ? 'Last Week' : `${shortDate(week[0])} - ${shortDate(week[6])}`;

  const topicList = [];
  Object.keys(subjects).forEach((s) => subjects[s].forEach((t) => topicList.push({ subject: s, topic: t })));

  const pickPaper = (p) => {
    addPlanItem({
      dateKey: modalDate,
      kind: 'paper',
      refId: p.id,
      title: p.title,
      subtitle: `${p.subject} · ${p.duration} min`,
    });
    setModalDate(null);
  };

  const pickTopic = (t) => {
    addPlanItem({
      dateKey: modalDate,
      kind: 'topic',
      refId: `${t.subject}|${t.topic}`,
      title: t.topic,
      subtitle: `${t.subject} · Topic revision`,
    });
    setModalDate(null);
  };

  return (
    <View style={screenStyle}>
      {/* Week selector */}
      <View style={styles.weekBar}>
        <TouchableOpacity style={styles.arrow} onPress={() => setOffset(offset - 1)}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.weekTitle}>{weekLabel}</Text>
          <Text style={styles.weekSub}>
            {shortDate(week[0])} - {shortDate(week[6])}
          </Text>
        </View>
        <TouchableOpacity style={styles.arrow} onPress={() => setOffset(offset + 1)}>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        {week.map((d) => {
          const key = toKey(d);
          const tasks = plan.filter((p) => p.dateKey === key);
          const isToday = key === today;
          return (
            <View key={key} style={[styles.dayCard, isToday && styles.dayToday]}>
              <View style={styles.dayHeader}>
                <View style={[styles.dateBubble, isToday && { backgroundColor: colors.primary }]}>
                  <Text style={[styles.dateNum, isToday && { color: '#fff' }]}>{d.getDate()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.dayName}>{dayName(d)}{isToday ? ' · Today' : ''}</Text>
                  <Text style={styles.daySub}>{tasks.length} task{tasks.length === 1 ? '' : 's'}</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => { setTab('paper'); setModalDate(key); }}>
                  <Ionicons name="add" size={18} color={colors.primary} />
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
              </View>

              {tasks.map((t) => (
                <View key={t.id} style={styles.taskRow}>
                  <TouchableOpacity onPress={() => togglePlanItem(t.id)} hitSlop={8}>
                    <Ionicons
                      name={t.done ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={t.done ? colors.success : colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, marginLeft: 10 }}
                    onPress={() => {
                      if (t.kind === 'paper') navigation.navigate('PaperDetails', { paperId: t.refId });
                      else {
                        const [subject, topic] = t.refId.split('|');
                        navigation.navigate('TopicDetails', { subject, topic });
                      }
                    }}
                  >
                    <Text style={[styles.taskTitle, t.done && styles.taskDone]}>{t.title}</Text>
                    <Text style={styles.taskSub}>{t.subtitle}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removePlanItem(t.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Assign modal */}
      <Modal visible={!!modalDate} transparent animationType="slide" onRequestClose={() => setModalDate(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add to plan</Text>
              <TouchableOpacity onPress={() => setModalDate(null)}>
                <Ionicons name="close" size={26} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Chip label="Papers" active={tab === 'paper'} onPress={() => setTab('paper')} />
              <Chip label="Topics" active={tab === 'topic'} onPress={() => setTab('topic')} />
            </View>
            {tab === 'paper' ? (
              <FlatList
                data={papers}
                keyExtractor={(p) => p.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.pickRow} onPress={() => pickPaper(item)}>
                    <Text style={styles.pickTitle}>{item.title}</Text>
                    <Text style={styles.pickSub}>{item.code}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={topicList}
                keyExtractor={(t) => `${t.subject}${t.topic}`}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.pickRow} onPress={() => pickTopic(item)}>
                    <Text style={styles.pickTitle}>{item.topic}</Text>
                    <Text style={styles.pickSub}>{item.subject}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  weekBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekTitle: { fontSize: 17, fontWeight: '900', color: colors.text },
  weekSub: { color: colors.muted, fontWeight: '600', fontSize: 12 },
  dayCard: { ...cardStyle },
  dayToday: { borderColor: colors.primary, borderWidth: 2.5 },
  dayHeader: { flexDirection: 'row', alignItems: 'center' },
  dateBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNum: { fontWeight: '900', fontSize: 16, color: colors.primary },
  dayName: { fontWeight: '900', fontSize: 16, color: colors.text },
  daySub: { color: colors.muted, fontWeight: '600', fontSize: 12 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addText: { color: colors.primary, fontWeight: '800', marginLeft: 2 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  taskTitle: { fontWeight: '800', color: colors.text, fontSize: 15 },
  taskDone: { textDecorationLine: 'line-through', color: colors.muted },
  taskSub: { color: colors.muted, fontWeight: '600', fontSize: 12, marginTop: 2 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '75%',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  pickRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  pickTitle: { fontWeight: '800', color: colors.text, fontSize: 15 },
  pickSub: { color: colors.muted, fontWeight: '600', fontSize: 12, marginTop: 2 },
});
