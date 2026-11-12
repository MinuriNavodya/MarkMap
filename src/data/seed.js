import { daysAgoKey } from '../utils/dates';

// Syllabus topics for every subject (own dataset, stored locally).
export const SUBJECT_TOPICS = {
  Physics: ['Mechanics', 'Waves', 'Thermal Physics', 'Electricity', 'Magnetism', 'Optics', 'Modern Physics'],
  Chemistry: [
    'Atomic Structure',
    'Chemical Bonding',
    'Organic Chemistry',
    'Equilibrium',
    'Electrochemistry',
    'Thermochemistry',
    'Kinetics',
  ],
  'Combined Maths': ['Algebra', 'Calculus', 'Vectors', 'Statistics', 'Mechanics', 'Trigonometry', 'Coordinate Geometry'],
  Biology: [
    'Cell Biology',
    'Genetics',
    'Plant Physiology',
    'Human Physiology',
    'Ecology',
    'Evolution',
    'Biochemistry',
  ],
  ICT: ['Number Systems', 'Networking', 'Databases', 'Programming', 'Web Design', 'Digital Logic', 'Information Systems'],
};

const CODES = {
  Physics: 'PHY',
  Chemistry: 'CHE',
  'Combined Maths': 'CMT',
  Biology: 'BIO',
  ICT: 'ICT',
};

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

const buildPapers = () => {
  const papers = [];
  let n = 1;
  Object.keys(SUBJECT_TOPICS).forEach((subject, si) => {
    const topics = SUBJECT_TOPICS[subject];
    YEARS.forEach((year, yi) => {
      const start = (si * 2 + yi * 3) % topics.length;
      const covered = [0, 1, 2, 3].map((k) => topics[(start + k) % topics.length]);
      const isStructured = yi % 2 === 0;
      papers.push({
        id: `p${n}`,
        code: `${CODES[subject]}-${year}-P${isStructured ? 1 : 2}`,
        title: `${subject} ${year} ${isStructured ? 'Paper I' : 'Paper II'}`,
        subject,
        year,
        type: isStructured ? 'MCQ + Essay' : 'Structured + Essay',
        totalMarks: 100,
        duration: isStructured ? 180 : 150,
        topics: covered,
      });
      n += 1;
    });
  });
  return papers;
};

export const PAPERS = buildPapers();

export const DEFAULT_TARGETS = {
  Physics: 75,
  Chemistry: 75,
  'Combined Maths': 80,
  Biology: 75,
  ICT: 85,
};

// Sample attempts so the app has data on first launch.
const ATTEMPT_SPECS = [
  { paperId: 'p6', daysAgo: 1, score: 58, timeTaken: 175, weak: 2 },
  { paperId: 'p5', daysAgo: 4, score: 64, timeTaken: 145, weak: 1 },
  { paperId: 'p12', daysAgo: 3, score: 47, timeTaken: 160, weak: 2 },
  { paperId: 'p11', daysAgo: 8, score: 55, timeTaken: 150, weak: 2 },
  { paperId: 'p18', daysAgo: 2, score: 71, timeTaken: 145, weak: 1 },
  { paperId: 'p17', daysAgo: 6, score: 66, timeTaken: 175, weak: 2 },
  { paperId: 'p24', daysAgo: 5, score: 78, timeTaken: 140, weak: 1 },
  { paperId: 'p30', daysAgo: 7, score: 82, timeTaken: 110, weak: 1 },
  { paperId: 'p6', daysAgo: 12, score: 52, timeTaken: 180, weak: 2 },
  { paperId: 'p12', daysAgo: 14, score: 43, timeTaken: 170, weak: 3 },
];

export const buildSeedAttempts = () =>
  ATTEMPT_SPECS.map((s, i) => {
    const paper = PAPERS.find((p) => p.id === s.paperId);
    return {
      id: `seed${i + 1}`,
      paperId: s.paperId,
      date: daysAgoKey(s.daysAgo),
      score: s.score,
      timeTaken: s.timeTaken,
      notes: '',
      weakTopics: paper.topics.slice(0, s.weak),
    };
  });
