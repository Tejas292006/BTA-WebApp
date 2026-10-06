import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Sidenav from './components/Sidenav';
import DashBoardLayout from './components/DashBoardLayout';
import Home from './pages/Home';
import ProductPageForm from './components/ProductPageForm';
import { Toaster } from 'react-hot-toast';
import Inventory from './pages/Inventory';
import { useRecoilValue } from 'recoil';
import { darkmodeAtom, globalLoaderAtom } from './store';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './router/PrivateRoute';
import Loader from "./components/Loader";
import Challan from './pages/Challan';
import Customer from './pages/Customer';
import QuickChallan from './pages/QuickChallan';
import Invoice from './pages/Invoice';
import InvoicePreview from './pages/InvoicePreview';
import Report from './pages/Report';
import Payments from './pages/Payments';
<<<<<<< HEAD
import Supplier from './pages/Supplier';
=======
import { useEffect } from 'react';
>>>>>>> 9bdc905d4602de46730b8316e2cc432af3cd5fe4
const routesConfig = [
  { path: '/', element: <Home /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/challan', element: <div className='px-5'><Challan /></div> },
  { path: '/customers', element: <Customer /> },
  { path: '/quick-challan', element: <QuickChallan /> },
  { path: '/invoice', element: <Invoice /> },
  { path: '/invoice-preview/:id', element: <InvoicePreview /> },
  { path: '/payments', element: <Payments /> },
  { path: '/reports', element: <Report /> },
  { path: '/suppliers', element: <Supplier /> },
  {
    path: '/product/:id',
    element: <ProductPageForm />,
  },
];

function generateRoutes(config) {
  return config.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={
        <PrivateRoute>
          <DashBoardLayout>
            {route.element}
          </DashBoardLayout>
        </PrivateRoute>
      }
    />
  ));
}

function App() {

  const mode = useRecoilValue(darkmodeAtom);
  const isLoading = useRecoilValue(globalLoaderAtom);

  useEffect(() => {
    localStorage.setItem("darkmode", mode);
    document.documentElement.classList.toggle("dark", mode);
  }, [mode]);

  return (
    <div className={`main-dashboard ${mode && 'dark'}`}>
      <Toaster />
      {isLoading && <>
        <Loader />

      </>}
      {/* <Sidenav /> */}
      <div className='h-screen overflow-scroll w-screen border-green-400'>
        <Routes>
          {generateRoutes(routesConfig)}
          <Route
            path='/login'
            element={<LoginPage />}
          />
          <Route
            path='/404'
            element={
              <PrivateRoute>
                <DashBoardLayout>
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <h1 className="text-6xl font-bold font-font2 text-gray-400 dark:text-gray-300">404</h1>
                    <p className="text-xl font-font1 text-gray-500 dark:text-gray-400">Page not found</p>
                    <a href="/" className="px-6 py-2 bg-black text-white rounded-lg font-font1 hover:bg-gray-800 transition dark:bg-[#d8f275] dark:text-[#1f1e30] dark:hover:bg-white">Go Home</a>
                  </div>
                </DashBoardLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
