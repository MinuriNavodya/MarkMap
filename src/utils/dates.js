const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayKey = () => toKey(new Date());

export const daysAgoKey = (n) => toKey(new Date(Date.now() - n * 86400000));

export const parseKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const isValidKey = (key) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const d = parseKey(key);
  return toKey(d) === key;
};

export const shortDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

export const prettyKey = (key) => {
  const d = parseKey(key);
  return `${DAYS[d.getDay()]}, ${shortDate(d)} ${d.getFullYear()}`;
};

export const dayName = (d) => DAYS[d.getDay()];

// Returns the 7 dates (Mon..Sun) of the week, offset by whole weeks from the current one.
export const getWeekDates = (offset = 0) => {
  const now = new Date();
  const sinceMonday = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sinceMonday + offset * 7);
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
};
