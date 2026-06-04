import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './styles.css';

document.getElementById('seo-fallback')?.remove();
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
