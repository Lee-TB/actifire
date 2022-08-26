import React from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  FirebaseAppProvider,
  AuthProvider,
  FirestoreProvider,
  useFirebaseApp,
} from 'reactfire';

const firebaseConfig = {
  apiKey: 'AIzaSyA0hdXSD52Ah4YiPZ2oOwpkP6KoGlbfYUA',
  authDomain: 'activity-manager-e908b.firebaseapp.com',
  projectId: 'activity-manager-e908b',
  storageBucket: 'activity-manager-e908b.appspot.com',
  messagingSenderId: '349571751001',
  appId: '1:349571751001:web:d4baa2fd1c77517450e548',
  measurementId: 'G-F2C3CS6HXX',
};

function FirebaseConfig({ children }) {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  );
}

function FirebaseConfigProvider({ children }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseConfig>{children}</FirebaseConfig>
    </FirebaseAppProvider>
  );
}

export default FirebaseConfigProvider;
