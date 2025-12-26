import dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

dotenv.config();

let serviceAccount;

// Try to load from env variable first
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (serviceAccountJson) {
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
    console.log('✅ Firebase credentials loaded from FIREBASE_SERVICE_ACCOUNT_JSON env var');
  } catch (err) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
    process.exit(1);
  }
} else {
  // Fallback to local file
  try {
    serviceAccount = JSON.parse(
      readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
    );
    console.log('✅ Firebase credentials loaded from serviceAccountKey.json');
  } catch (err) {
    console.error('❌ Could not load Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON env var or provide serviceAccountKey.json');
    process.exit(1);
  }
}

let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized');
} else {
  app = getApps()[0];
}

// Named export
export const admin = {
  auth: getAuth(app),
};
