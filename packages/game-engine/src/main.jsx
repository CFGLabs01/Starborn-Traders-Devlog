import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-600">Game Engine</h1>
      <p>Core game logic will be developed here.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 