import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PAPERS, SUBJECT_TOPICS, DEFAULT_TARGETS, buildSeedAttempts } from '../data/seed';
import { loadData, saveData, clearData } from '../storage/storage';
import { colors } from '../theme';

const AppContext = createContext(null);

// A new account starts clean (no attempts, no plan). Sample data can be loaded from Settings.
const buildInitial = () => ({
  papers: PAPERS,
  attempts: [],
  plan: [],
  targets: { ...DEFAULT_TARGETS },
});

const uid = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

export function AppProvider({ userId, children }) {
  const [data, setData] = useState(null);

  // Load this user's own data.
  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await loadData(userId);
      if (active) setData(saved || buildInitial());
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  // Save every change under this user's key.
  useEffect(() => {
    if (data) saveData(userId, data);
  }, [data, userId]);

  const addAttempt = useCallback((attempt) => {
    setData((prev) => ({ ...prev, attempts: [...prev.attempts, { ...attempt, id: uid() }] }));
  }, []);

  const updateAttempt = useCallback((id, changes) => {
    setData((prev) => ({
      ...prev,
      attempts: prev.attempts.map((a) => (a.id === id ? { ...a, ...changes } : a)),
    }));
  }, []);

  const deleteAttempt = useCallback((id) => {
    setData((prev) => ({ ...prev, attempts: prev.attempts.filter((a) => a.id !== id) }));
  }, []);

  const addPlanItem = useCallback((item) => {
    setData((prev) => ({ ...prev, plan: [...prev.plan, { ...item, id: uid(), done: false }] }));
  }, []);

  const togglePlanItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      plan: prev.plan.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    }));
  }, []);

  const removePlanItem = useCallback((id) => {
    setData((prev) => ({ ...prev, plan: prev.plan.filter((p) => p.id !== id) }));
  }, []);

  const setTarget = useCallback((subject, value) => {
    const v = Math.max(0, Math.min(100, value));
    setData((prev) => ({ ...prev, targets: { ...prev.targets, [subject]: v } }));
  }, []);

  // keepSample = true  -> reset and load the sample attempts
  // keepSample = false -> reset and clear all attempts and plans
  const resetData = useCallback(
    async (keepSample = true) => {
      await clearData(userId);
      const fresh = buildInitial();
      if (keepSample) fresh.attempts = buildSeedAttempts();
      setData(fresh);
    },
    [userId]
  );

  if (!data) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const value = {
    ...data,
    subjects: SUBJECT_TOPICS,
    addAttempt,
    updateAttempt,
    deleteAttempt,
    addPlanItem,
    togglePlanItem,
    removePlanItem,
    setTarget,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
