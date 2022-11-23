import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider, AntdConfigProvider } from './contexts';
import App from './App';
import '~/translator/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <AntdConfigProvider>
          <App />
        </AntdConfigProvider>
      </FirebaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
