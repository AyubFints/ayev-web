import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Agar sizda css fayl nomi boshqacha bo'lsa to'g'irlang

// Bu yerda biz butun dasturni "React" qutisiga solib, ishga tushiramiz.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)