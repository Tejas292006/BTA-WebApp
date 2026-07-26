import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import {
  RecoilRoot,
} from 'recoil';
import Loader from './components/Loader/Loader.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <NextUIProvider>
        <RecoilRoot>
          <ErrorBoundary>
          <React.Suspense fallback={<Loader />}>
            <App />
          </React.Suspense>
          </ErrorBoundary>
        </RecoilRoot>
      </NextUIProvider>
    </BrowserRouter>
 
)
