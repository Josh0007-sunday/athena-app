import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'

// Set global API base URL from Vite environment variables
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
