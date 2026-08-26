import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AdminApp } from './admin/AdminApp.tsx'
import './index.css'

// No router dependency for two top-level apps and no client-side navigation
// between them — a path check is the whole thing a router would buy here.
const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>,
)
