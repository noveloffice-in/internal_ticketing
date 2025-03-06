import { FrappeProvider } from 'frappe-react-sdk'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <FrappeProvider>
    <App />
  </FrappeProvider>,
)
