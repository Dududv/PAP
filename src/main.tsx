import { createRoot } from 'react-dom/client'
import React, { lazy, Suspense } from 'react'
import './index.css'

const LazyApp = lazy(() => import('./App.tsx'))

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <LazyApp />
    </Suspense>
  </React.StrictMode>
);
