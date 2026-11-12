import { SUBJECT_TOPICS } from '../data/seed';

export const pct = (score, total) => (total ? Math.round((score / total) * 100) : 0);

export const sortAttemptsDesc = (list) =>
  [...list].sort((a, b) => (a.date === b.date ? (a.id < b.id ? 1 : -1) : a.date < b.date ? 1 : -1));

export const sortAttemptsAsc = (list) => [...list].reverse().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

export const paperMap = (papers) => {
  const map = {};
  papers.forEach((p) => {
    map[p.id] = p;
  });
  return map;
};

export const latestAttemptForPaper = (attempts, paperId) => {
  const list = sortAttemptsDesc(attempts.filter((a) => a.paperId === paperId));
  return list.length ? list[0] : null;
};

export function computeOverview(papers, attempts) {
  const map = paperMap(papers);
  const percents = attempts.filter((a) => map[a.paperId]).map((a) => pct(a.score, map[a.paperId].totalMarks));
  const average = percents.length ? Math.round(percents.reduce((s, v) => s + v, 0) / percents.length) : 0;
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthAttempts = attempts.filter((a) => a.date.startsWith(prefix));
  const distinctPapers = new Set(monthAttempts.map((a) => a.paperId));
  return {
    average,
    totalAttempts: attempts.length,
    attemptedThisMonth: distinctPapers.size,
  };
}

// Stats for every topic: how often it was flagged weak and the estimated marks lost.
export function computeTopicStats(papers, attempts) {
  const map = paperMap(papers);
  const stats = {};
  Object.keys(SUBJECT_TOPICS).forEach((subject) => {
    SUBJECT_TOPICS[subject].forEach((topic) => {
      stats[`${subject}|${topic}`] = { subject, topic, flagged: 0, involved: 0, lost: 0 };
    });
  });
  attempts.forEach((a) => {
    const paper = map[a.paperId];
    if (!paper) return;
    paper.topics.forEach((t) => {
      const s = stats[`${paper.subject}|${t}`];
      if (s) s.involved += 1;
    });
    const weak = a.weakTopics || [];
    const lostMarks = Math.max(0, paper.totalMarks - a.score);
    const share = weak.length ? lostMarks / weak.length : 0;
    weak.forEach((t) => {
      const s = stats[`${paper.subject}|${t}`];
      if (s) {
        s.flagged += 1;
        s.lost += share;
      }
    });
  });
  return Object.values(stats).map((s) => ({
    ...s,
    lost: Math.round(s.lost),
    errorPct: s.involved ? Math.round((s.flagged / s.involved) * 100) : 0,
  }));
}

export function computeWeakTopics(papers, attempts, subjectFilter = 'All') {
  return computeTopicStats(papers, attempts)
    .filter((s) => s.flagged > 0 && (subjectFilter === 'All' || s.subject === subjectFilter))
    .sort((a, b) => b.lost - a.lost || b.flagged - a.flagged);
}
