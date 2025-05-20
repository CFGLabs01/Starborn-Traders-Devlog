import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // We'll create this next for Tailwind base styles

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">UI Kit</h1>
      <p>Components will live here.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 