import React from 'react';
import ReactDOM from 'react-dom/client';
import { FirebaseConfigProvider, AntdConfigProvider } from './contexts';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseConfigProvider>
      <AntdConfigProvider>
        <App />
      </AntdConfigProvider>
    </FirebaseConfigProvider>
  </React.StrictMode>
);
