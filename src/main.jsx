import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './App.jsx'
import './index.css' // Import this FIRST
import './styles/main.css' // Import this SECOND

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
) 