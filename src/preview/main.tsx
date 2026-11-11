import React from 'react';
import ReactDOM from 'react-dom/client';
import { ComponentPreview } from './ComponentPreview';
import { PagePreview } from './PagePreview';
import '../styles/global.css';

// /preview.html → 공통 컴포넌트, /preview.html?page=goal-setting|memo → 페이지 미리보기
const page = new URLSearchParams(window.location.search).get('page');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{page ? <PagePreview page={page} /> : <ComponentPreview />}</React.StrictMode>,
);
