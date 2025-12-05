import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { EmailsProvider } from './state/emails'
import { ToastProvider } from './state/toast'
import ToastContainer from './components/ToastContainer'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <EmailsProvider>
          <App />
          <ToastContainer />
        </EmailsProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
