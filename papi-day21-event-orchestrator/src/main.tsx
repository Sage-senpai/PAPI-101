// ============================================================================
// FILE: papi-event-orchestrator/src/main.tsx
// PURPOSE: React application entry point
// STATUS: READY - Standard React 19 setup
// ============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)