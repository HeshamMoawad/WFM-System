import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import Pages from './pages/Pages';
import AuthContextProvider from './contexts/authContext';
import ModeContextProvider from './contexts/DarkModeContext'; 
import LanguageContextProvider from './contexts/LanguageContext';
import VersionContextProvider from './contexts/versionContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <VersionContextProvider>
        <ModeContextProvider>
          <LanguageContextProvider>
            <Pages/>
          </LanguageContextProvider>
        </ModeContextProvider>
      </VersionContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
