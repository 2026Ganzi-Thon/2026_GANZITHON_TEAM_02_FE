import React from 'react';
import ReactDOM from 'react-dom/client';
import { ComponentPreview } from './ComponentPreview';
import '../styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ComponentPreview />
  </React.StrictMode>,
);
