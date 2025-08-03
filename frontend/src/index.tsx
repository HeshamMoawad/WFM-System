import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import Pages from './pages/Pages';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './contexts/authContext';
import ModeContextProvider from './contexts/DarkModeContext'; 
import LanguageContextProvider from './contexts/LanguageContext';
import VersionContextProvider from './contexts/versionContext';
import { store } from './store/store';
import { Provider } from 'react-redux';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthContextProvider>
          <VersionContextProvider>
            <ModeContextProvider>
              <LanguageContextProvider>
                <Pages />
              </LanguageContextProvider>
            </ModeContextProvider>
          </VersionContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
