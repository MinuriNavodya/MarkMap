import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, primaryButton, screenStyle } from '../theme';
import { isValidKey, todayKey } from '../utils/dates';

export default function AddEditAttemptScreen({ route, navigation }) {
  const { papers, attempts, addAttempt, updateAttempt, deleteAttempt } = useApp();
  const { paperId: initialPaperId, attemptId } = route.params || {};
  const editing = attempts.find((a) => a.id === attemptId);

  const [paperId, setPaperId] = useState(editing ? editing.paperId : initialPaperId || null);
  const [date, setDate] = useState(editing ? editing.date : todayKey());
  const [score, setScore] = useState(editing ? String(editing.score) : '');
  const [time, setTime] = useState(editing && editing.timeTaken ? String(editing.timeTaken) : '');
  const [notes, setNotes] = useState(editing ? editing.notes || '' : '');
  const [weak, setWeak] = useState(editing ? editing.weakTopics || [] : []);
  const [open, setOpen] = useState(false);

  const paper = papers.find((p) => p.id === paperId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: editing ? 'Edit Attempt' : 'Log Attempt' });
  }, [navigation, editing]);

  const choosePaper = (p) => {
    setPaperId(p.id);
    setWeak((w) => w.filter((t) => p.topics.includes(t)));
    setOpen(false);
  };

  const toggleTopic = (t) => {
    setWeak((w) => (w.includes(t) ? w.filter((x) => x !== t) : [...w, t]));
  };

  const save = () => {
    if (!paper) return Alert.alert('Select a paper', 'Please choose which paper you attempted.');
    if (!isValidKey(date)) return Alert.alert('Invalid date', 'Use the format YYYY-MM-DD, for example 2026-11-07.');
    if (score.trim() === '' || isNaN(Number(score))) return Alert.alert('Invalid score', 'Enter your score as a number.');
    const s = Number(score);
    if (s < 0 || s > paper.totalMarks) {
      return Alert.alert('Invalid score', `Score must be between 0 and ${paper.totalMarks}.`);
    }
    if (time.trim() !== '' && (isNaN(Number(time)) || Number(time) < 0)) {
      return Alert.alert('Invalid time', 'Time taken must be a number of minutes.');
    }
    const payload = {
      paperId: paper.id,
      date,
      score: s,
      timeTaken: time.trim() === '' ? 0 : Number(time),
      notes: notes.trim(),
      weakTopics: weak,
    };
    if (editing) updateAttempt(editing.id, payload);
    else addAttempt(payload);
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert('Delete attempt', 'This attempt will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteAttempt(editing.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={screenStyle} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Paper</Text>
        <TouchableOpacity style={styles.input} onPress={() => setOpen(!open)}>
          <Text style={[styles.inputText, !paper && { color: colors.muted }]} numberOfLines={1}>
            {paper ? `${paper.title} (${paper.code})` : 'Select a paper'}
          </Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        </TouchableOpacity>
        {open && (
          <View style={styles.dropdown}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 220 }}>
              {papers.map((p) => (
                <TouchableOpacity key={p.id} style={styles.option} onPress={() => choosePaper(p)}>
                  <Text style={[styles.optionText, p.id === paperId && { color: colors.primary }]}>{p.title}</Text>
                  <Text style={styles.optionSub}>{p.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2026-11-07"
          placeholderTextColor={colors.muted}
          keyboardType="numbers-and-punctuation"
        />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Score {paper ? `(out of ${paper.totalMarks})` : ''}</Text>
            <TextInput
              style={styles.input}
              value={score}
              onChangeText={setScore}
              placeholder="e.g. 68"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Time taken (min)</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 150"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Weak topics in this paper</Text>
        {!paper ? (
          <Text style={styles.hint}>Select a paper to choose weak topics.</Text>
        ) : (
          <View style={styles.topicWrap}>
            {paper.topics.map((t) => {
              const on = weak.includes(t);
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.topicChip, on && styles.topicChipOn]}
                  onPress={() => toggleTopic(t)}
                >
                  <Ionicons
                    name={on ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={on ? colors.text : colors.muted}
                  />
                  <Text style={styles.topicText}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="What went wrong? What to improve?"
          placeholderTextColor={colors.muted}
          multiline
        />

        <TouchableOpacity style={[primaryButton, { marginTop: 22 }]} onPress={save}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.btnText}>Save Attempt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        {editing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '900', color: colors.text, marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontWeight: '700',
    color: colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: { fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
  },
  option: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  optionText: { fontWeight: '800', color: colors.text },
  optionSub: { color: colors.muted, fontWeight: '600', fontSize: 12 },
  hint: { color: colors.muted, fontWeight: '600' },
  topicWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  topicChipOn: { backgroundColor: colors.amberSoft },
  topicText: { fontWeight: '800', color: colors.text, marginLeft: 6, fontSize: 13 },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16, marginLeft: 8 },
  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  cancelText: { fontWeight: '900', color: colors.text, fontSize: 16 },
  deleteBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.danger,
  },
});
