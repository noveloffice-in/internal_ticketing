import { FrappeProvider } from 'frappe-react-sdk'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const hostUrl = window.location.href.split('/')[2]?.split(':')[0];

createRoot(document.getElementById('root')).render(
  <FrappeProvider
    socketPort='9000'
    url={`http://${hostUrl}/`}
  >
    <App />
  </FrappeProvider>,
)
