import { StrictMode, createContext } from "react";
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import './main.css'
import AuthRequired from './pages/AuthRequired';
import Report from './pages/Report';
import Scan from './pages/Scan';
import ScanDetail from './pages/ScanDetail';
import Confirm from "./pages/confirm.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReportDetail from "./pages/ReportDetail.jsx";
import Store from './store/store'
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService"
import CookiePolicy from "./pages/CookiePolicy"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000 * 60,
    },
  },
})

const store = new Store()
export const Context = createContext({store})

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'profile', index: false, element: <AuthRequired><Profile /></AuthRequired> },
            { path: 'reports', index: false, element: (<Reports />) },
            { path: 'scan', index: false, element: (<Scan />) },
            { path: 'scan/website/:web_url', index: true, element: (<ScanDetail/>) },
            { path: 'scan/crypto/:crypto_address', index: true, element: (<ScanDetail/>) },
            { path: 'report', index: false, element:  <Report /> },
            { path: 'report/show/:id/:slug', index: true, element: (<ReportDetail />) },
            { path: 'confirm/:option/:token', index: false, element: (<Confirm />) },
            { path: 'legal/privacy-policy', index: false, element: (<PrivacyPolicy />) },
            { path: 'legal/terms-of-service', index: false, element: (<TermsOfService />) },
            { path: 'legal/cookie-policy', index: false, element: (<CookiePolicy />) },
        ],
    },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={{ store }}>
        <RouterProvider router={router} />
      </Context.Provider>
    </QueryClientProvider>
  </StrictMode>
)
