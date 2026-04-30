import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// We removed the index.css import to stop the Tailwind error

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)