import { Route, Routes } from 'react-router-dom';
import './App.css'
import Sidenav from './components/SideNav/Sidenav'
import DashBoardLayout from './Layout/DashboardLayout/DashBoardLayout';
import Home from './pages/Home/Home';
import ProductPageForm from './components/ProductPage/ProductPageForm';
import { Toaster } from 'react-hot-toast';
import Inventory from './pages/Inventory/Inventory';
import { useRecoilValue } from 'recoil';
import { darkmodeAtom } from './store/darkmode/darkAtom';
import LoginPage from './pages/LoginPage/LoginPage';
import PrivateRoute from './Private/PrivateRoute';
import { globalLoaderAtom } from './store/GlobalLoader/globalLoaderAtom';
import Loader from "./components/Loader/Loader"
import Challan from './pages/Challan/Challan';
import Customer from './pages/Customer/Customer';
import QuickChallan from './pages/QuickChallan/QuickChallan';
import Invoice from './pages/Invoice/Invoice';
import InvoicePreview from './pages/Invoice/InvoicePreview';
import Report from './pages/Reports/Report';
import Payments from './pages/Payments/Payments';
const routesConfig = [
  { path: '/', element: <Home /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/challan', element: <div className='px-5'><Challan /></div> },
  { path: '/customers', element: <Customer /> },
  { path: '/quick-challan', element: <QuickChallan /> },
  { path: '/invoice', element: <Invoice /> },
  { path: '/payments', element: <Payments /> },
  { path: '/reports', element: <Report /> },
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
        <DashBoardLayout>
          <PrivateRoute>
            {route.element}
          </PrivateRoute>
        </DashBoardLayout>
      }
    />
  ));
}

function App() {

  const mode = useRecoilValue(darkmodeAtom);
  const isLoading = useRecoilValue(globalLoaderAtom);

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
            path='/invoice-preview/:id'
            element={<InvoicePreview />}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
