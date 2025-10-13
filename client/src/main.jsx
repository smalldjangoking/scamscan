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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
            { path: 'reports', index: false, element: (
            <QueryClientProvider client={queryClient}>
                <Reports />
            </QueryClientProvider>
            ) },
            { path: 'scan', index: false, element: (
                    <QueryClientProvider client={queryClient}>
                        <Scan />
                    </QueryClientProvider>
                ) },
            { path: 'report', index: false, element:  <Report /> },
        ],
    },
]);
createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}></RouterProvider>
)
