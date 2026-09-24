// Import React để bật StrictMode và các API liên quan.
import React from 'react';
// Import API tạo root của React 18.
import ReactDOM from 'react-dom/client';
// Import component giao diện chính.
import App from './App';
// Import stylesheet toàn cục.
import './index.css';

// Tìm phần tử root trong index.html và gắn ứng dụng React vào đó.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // StrictMode giúp phát hiện một số vấn đề trong lúc phát triển.
  <React.StrictMode>
    // App là component đầu tiên của cây giao diện.
    <App />
  </React.StrictMode>,
);
