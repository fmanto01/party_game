import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { io } from 'socket.io-client'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = io('http://localhost:3001');


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
