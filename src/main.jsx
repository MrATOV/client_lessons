import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from "react-router-dom";
import { ContextProvider } from "./Context"

createRoot(document.getElementById('root')).render(
    <ContextProvider>
      <Router>
        <App/>
      </Router>
    </ContextProvider>
)