import { createContext } from "react";
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import './main.css'
import AuthRequired from './pages/AuthRequired';
import Report from './pages/Report';
import Scan from './pages/Scan';
import ScanDetail from './pages/ScanDetail';
import Confirm from "./pages/Confirm.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReportDetail from "./pages/ReportDetail.jsx";
import Store from './store/store'
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService"
import CookiePolicy from "./pages/CookiePolicy"
import { HelmetProvider } from "react-helmet-async";
import AboutUs from "./pages/About";
import Contact from "./pages/Contact";
import { useEffect } from "react";

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || "https://api.scamscan.io/admin";

function AdminRedirect() {
  useEffect(() => {
    window.location.replace(ADMIN_URL);
  }, []);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000 * 60,
    },
  },
})

const store = new Store()
export const Context = createContext({ store })

const router = createBrowserRouter([
  { path: "/admin", element: <AdminRedirect /> },
  { path: "/admin/*", element: <AdminRedirect /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <AuthRequired><Profile /></AuthRequired> },
      { path: 'reports', element: (<Reports />) },
      { path: 'scan', element: (<Scan />) },
      { path: 'scan/website/:web_url', element: (<ScanDetail />) },
      { path: 'scan/crypto/:crypto_address', element: (<ScanDetail />) },
      { path: 'report', element: <Report /> },
      { path: 'report/show/:id/:slug', element: (<ReportDetail />) },
      { path: 'confirm/:option/:token', element: (<Confirm />) },
      { path: 'legal/privacy-policy', element: (<PrivacyPolicy />) },
      { path: 'legal/terms-of-service', element: (<TermsOfService />) },
      { path: 'legal/cookie-policy', element: (<CookiePolicy />) },
      { path: 'about-us', element: (<AboutUs />)},
      { path: 'contact', element: (<Contact />)},
      { path: '*', element: <Navigate to="/" replace /> }
    ],
  },
]);
createRoot(document.getElementById('root')).render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={{ store }}>
          <RouterProvider router={router} />
        </Context.Provider>
      </QueryClientProvider>
    </HelmetProvider>
)
