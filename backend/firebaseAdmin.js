import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

// Named export
export const admin = {
  auth: getAuth(app),
};