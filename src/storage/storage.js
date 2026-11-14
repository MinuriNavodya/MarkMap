import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@markmap_users_v1';
const SESSION_KEY = '@markmap_session_v1';
const dataKey = (userId) => `@markmap_data_v2_${userId}`;

async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

async function writeJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore write errors
  }
}

/* ---------- Accounts (local only) ---------- */
export const getUsers = () => readJSON(USERS_KEY, []);
export const saveUsers = (users) => writeJSON(USERS_KEY, users);

export const getSession = async () => {
  try {
    return await AsyncStorage.getItem(SESSION_KEY);
  } catch (e) {
    return null;
  }
};
export const setSession = async (userId) => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, userId);
  } catch (e) {
    // ignore
  }
};
export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // ignore
  }
};

/* ---------- App data, one record per user ---------- */
export const loadData = (userId) => readJSON(dataKey(userId), null);
export const saveData = (userId, data) => writeJSON(dataKey(userId), data);
export const clearData = async (userId) => {
  try {
    await AsyncStorage.removeItem(dataKey(userId));
  } catch (e) {
    // ignore
  }
};
