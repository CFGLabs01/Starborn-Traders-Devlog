import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-purple-600">Data Simulation</h1>
      <p>Data models and simulation logic will go here.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 