import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle.js";
import ResetStyle from "./styles/ResetStyle.js";
import { ImgProvider } from './hooks/useImage.js';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ResetStyle />
    <GlobalStyle />
    <BrowserRouter>
    <ImgProvider>
      <App />
    </ImgProvider>
    </BrowserRouter>
  </React.StrictMode>
);