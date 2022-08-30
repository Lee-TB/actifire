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
  apiKey: 'AIzaSyC631Ji_Yxsa3KFy1grPdSuddSS_wdLLQI',
  authDomain: 'actifire.firebaseapp.com',
  projectId: 'actifire',
  storageBucket: 'actifire.appspot.com',
  messagingSenderId: '1070139088982',
  appId: '1:1070139088982:web:457e55852847d14e2a5bf7',
  measurementId: 'G-HGR2T83CBJ',
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

function FirebaseProvider({ children }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseConfig>{children}</FirebaseConfig>
    </FirebaseAppProvider>
  );
}

export default FirebaseProvider;
