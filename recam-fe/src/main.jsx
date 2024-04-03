import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/vendor/fontawesome-free/css/all.min.css'
import './assets/css/sb-admin-2.min.css'
import './assets/vendor/jquery/jquery.min.js';
import './assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import './assets/vendor/jquery-easing/jquery.easing.min.js';
import './assets/js/sb-admin-2.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
