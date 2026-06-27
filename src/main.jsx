import '@/styles/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Clear any old persisted onboarding settings to prevent caching issues during testing
localStorage.removeItem('chilld-user');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
