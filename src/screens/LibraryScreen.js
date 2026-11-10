import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Chip from '../components/Chip';
import PaperCard from '../components/PaperCard';
import { colors, screenStyle } from '../theme';
import { latestAttemptForPaper, pct } from '../utils/stats';

export default function LibraryScreen({ navigation }) {
  const { papers, attempts, subjects } = useApp();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');
  const [year, setYear] = useState('All');
  const [status, setStatus] = useState('All');

  const years = useMemo(() => ['All', ...Array.from(new Set(papers.map((p) => String(p.year)))).sort().reverse()], [papers]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return papers
      .map((p) => {
        const latest = latestAttemptForPaper(attempts, p.id);
        return { paper: p, scorePct: latest ? pct(latest.score, p.totalMarks) : null };
      })
      .filter(({ paper, scorePct }) => {
        if (subject !== 'All' && paper.subject !== subject) return false;
        if (year !== 'All' && String(paper.year) !== year) return false;
        if (status === 'Attempted' && scorePct === null) return false;
        if (status === 'Not Attempted' && scorePct !== null) return false;
        if (q) {
          const hay = `${paper.title} ${paper.code} ${paper.subject} ${paper.topics.join(' ')}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.paper.year - a.paper.year || a.paper.subject.localeCompare(b.paper.subject));
  }, [papers, attempts, query, subject, year, status]);

  return (
    <View style={screenStyle}>
      <View style={styles.top}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Search paper name, code or topic"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Ionicons name="close-circle" size={18} color={colors.muted} onPress={() => setQuery('')} />
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {['All', ...Object.keys(subjects)].map((s) => (
            <Chip key={s} label={s} active={subject === s} onPress={() => setSubject(s)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {years.map((y) => (
            <Chip key={y} label={y === 'All' ? 'All Years' : y} active={year === y} onPress={() => setYear(y)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {['All', 'Attempted', 'Not Attempted'].map((s) => (
            <Chip key={s} label={s} active={status === s} onPress={() => setStatus(s)} />
          ))}
        </ScrollView>
        <Text style={styles.count}>{rows.length} papers</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.paper.id}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>No papers match your search or filters.</Text>}
        renderItem={({ item }) => (
          <PaperCard
            paper={item.paper}
            scorePct={item.scorePct}
            onPress={() => navigation.navigate('PaperDetails', { paperId: item.paper.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 11, paddingHorizontal: 8, color: colors.text, fontWeight: '600' },
  chipRow: { marginTop: 10, flexGrow: 0 },
  count: { marginTop: 10, marginBottom: 6, color: colors.muted, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 40, color: colors.muted, fontWeight: '700' },
});
