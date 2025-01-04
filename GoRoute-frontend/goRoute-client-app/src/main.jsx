import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import { GoogleOAuthProvider } from '@react-oauth/google';




const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log(CLIENT_ID,'iddd');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>

        <App />
      </GoogleOAuthProvider>
    </Provider>


  </StrictMode>,

)
