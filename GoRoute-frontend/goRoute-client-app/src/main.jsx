import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '95471622345-6mrooku1asdkjvraoqdr18k4jfo5gakf.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>

        <App />
      </GoogleOAuthProvider>
    </Provider>


  </StrictMode>,

)
