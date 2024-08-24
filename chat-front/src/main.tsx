import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { persistor, store } from './store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NotificationProvider } from './providers/NotificationProvider'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>

  </React.StrictMode>,
)
