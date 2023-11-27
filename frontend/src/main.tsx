import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { Providers } from './Providers.tsx'
import LandingPage from './pages/Landing.tsx'
import ErrorPage from './pages/Error.tsx'
import AboutPage from './pages/About.tsx'
import LoginPage from './pages/Login.tsx'
import DashboardPage from './pages/auth/Dashboard.tsx'
import CardsPage from './pages/auth/Cards.tsx'
import NewCardPage from './modals/NewCard.tsx'
import CardDetailPage from './pages/auth/CardDetail.tsx'
import CardSettingsPage from './pages/auth/CardSettings.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/cards",
    element: <CardsPage />,
  },
  {
    path: "/cards/detail",
    element: <CardDetailPage />,
  },
  {
    path: "/cards/settings",
    element: <CardSettingsPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
)
