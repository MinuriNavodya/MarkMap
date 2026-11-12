import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUsers, saveUsers, getSession, setSession, clearSession } from '../storage/storage';
import { hashPassword, makeSalt } from '../utils/hash';

const AuthContext = createContext(null);

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });
const normEmail = (email) => email.trim().toLowerCase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the saved session when the app starts.
  useEffect(() => {
    (async () => {
      const id = await getSession();
      if (id) {
        const users = await getUsers();
        const found = users.find((u) => u.id === id);
        if (found) setUser(publicUser(found));
        else await clearSession();
      }
      setLoading(false);
    })();
  }, []);

  const signUp = useCallback(async (name, email, password) => {
    const users = await getUsers();
    const e = normEmail(email);
    if (users.some((u) => u.email === e)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const salt = makeSalt();
    const hash = await hashPassword(password, salt);
    const created = {
      id: `u${Date.now()}`,
      name: name.trim(),
      email: e,
      salt,
      hash,
      createdAt: new Date().toISOString(),
    };
    await saveUsers([...users, created]);
    await setSession(created.id);
    setUser(publicUser(created));
    return { ok: true };
  }, []);

  const login = useCallback(async (email, password) => {
    const users = await getUsers();
    const found = users.find((u) => u.email === normEmail(email));
    if (!found) return { ok: false, error: 'No account found with this email.' };
    const hash = await hashPassword(password, found.salt);
    if (hash !== found.hash) return { ok: false, error: 'Incorrect password.' };
    await setSession(found.id);
    setUser(publicUser(found));
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, signUp, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
