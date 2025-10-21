import { StrictMode } from 'react'
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReportDetail from "./pages/ReportDetail.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000 * 60,
    },
  },
})

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
        ],
    },
]);
createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}><RouterProvider router={router}></RouterProvider></QueryClientProvider>
)
