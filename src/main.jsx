import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { FirebaseConfigProvider, AntdConfigProvider } from './contexts';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <FirebaseConfigProvider>
        <AntdConfigProvider>
          <App />
        </AntdConfigProvider>
      </FirebaseConfigProvider>
    </Router>
  </React.StrictMode>
);
