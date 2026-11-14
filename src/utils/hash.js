import * as Crypto from 'expo-crypto';

const toHex = (bytes) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

// Random salt so two users with the same password get different hashes.
export const makeSalt = () => toHex(Crypto.getRandomBytes(16));

// Returns the SHA-256 hex digest of salt + password. The plain password is never stored.
export const hashPassword = (password, salt) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
