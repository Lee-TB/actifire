import React from 'react';
import ReactDOM from 'react-dom/client';
import AntdConfigProvider from './AntdConfigProvider';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AntdConfigProvider>
      <App />
    </AntdConfigProvider>
  </React.StrictMode>
);
